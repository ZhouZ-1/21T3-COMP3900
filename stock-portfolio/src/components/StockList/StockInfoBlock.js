function StockInfoBlock(props) {
    const {data} = props;
    
    return (
        <>
            <div class='mt-2'>
                <span>symbol: {data[0]}</span>
                <br></br>
                <span>name: {data[1]}</span>
            </div>
        </>
    );
}

export default StockInfoBlock;