const Widget = () => {
	return (
        <iframe
        id="widget-iframe"
        title="Swap Widget"
        height="900px"
        width="100%"
        // style="border: none; border-radius: 19px; box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.1); display: none;"
        src="https://lifinance-widget-bunsdev.vercel.app"
        // onload="onFrameLoad()"
    >
    </iframe>
	);
};

export default Widget;