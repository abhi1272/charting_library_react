/* eslint-disable no-unreachable */
import React, { useEffect } from "react";
import Datafeed from "../trading-view/datafeed";
import {TradingView} from "../charting_library/charting_library.standalone";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8000");

const TradingViewChart = () => {
  useEffect(() => {
    console.log('-----trading----')
    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "%PUBLIC_URL%/charting_library/charting_library.js";
    document.head.appendChild(script);

    window.tvWidget = new TradingView.widget({
      symbol: "Monetax:AMC/USDT", // Default symbol pair
      interval: "1", // Default interval
      fullscreen: true, // Displays the chart in the fullscreen mode
      container: "tv_chart_container", // Reference to an attribute of a DOM element
      datafeed: Datafeed,
      library_path: "/charting_library/",
      disabled_features: [
        "use_localstorage_for_settings",
        "left_toolbar",
        "header_widget",
        "timeframes_toolbar",
        "edit_buttons_in_legend",
        "context_menus",
        "control_bar",
        "border_around_the_chart",
      ],
      overrides: {
        "paneProperties.background": "#222222",
        "paneProperties.vertGridProperties.color": "#454545",
        "paneProperties.horzGridProperties.color": "#454545",
        "scalesProperties.textColor": "#AAA",
      },
    });
    //Do not forget to remove the script on unmounting the component!

    socket.on("connect", () => {
      socket.emit('fetch-data')
      console.log("[socket] Connected");
    });
    
    socket.on("disconnect", (reason) => {
      console.log("[socket] Disconnected:", reason);
    });
    
    socket.on("error", (error) => {
      console.log("[socket] Error:", error);
    });
    return () => script.remove();

  }, []); //eslint-disable-line

  return <div id="tv_chart_container"></div>;
};

export default TradingViewChart;
