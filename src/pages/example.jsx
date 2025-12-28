import { useState, useEffect } from "react";


function ExamplePage() {
const [number, setNumber] = useState(0);

function increment() {
 setNumber(number + 1);
}

    return (
        <div>
            <h1>Example Page</h1>
            <p>This is an example page component.</p>
            <p>Number: {number}</p>
            <button onClick={increment} className="btn bg-dark-500">increment</button>
        </div>
    );
}

export default ExamplePage;