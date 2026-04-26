import { useState, useEffect } from "react";

function App(){
    const [forecast, setForecast] = useState([]); 
    const [zipcode, setzipCode] = useState('61525');
    const [errmsg,setErrmsg] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    function handleSubmit(event){
        event.preventDefault(); 
        setzipCode(event.target.zipcode.value);
    }
  /*The Effect hook is a React hook that allows a component to perform a "side effect".  
  ** A side effect is code that changes something outside of the component, like manually updating DOM elements or fetching data with a web API. 
  */
    useEffect(()=>{
        async function getForecast(){
            setForecast([]);
            setErrmsg(''); 
            setIsLoading(true);
            try{
                const response = await fetch(`https://wp.zybooks.com/weather.php?zip=${zipcode}`)
                if(response.ok){
                    const result = await response.json(); 
                if(result.success){
                    setForecast(result.forecast);
                } else{
                    setErrmsg("Forecast fetching error for your given zipcode: "+zipcode+". zipcode must be 5 digits long");
                }
            }
            }catch(err){
                setErrmsg(err.message);
            }finally{
            setIsLoading(false);
            }
        }
        getForecast();
    },[zipcode]); //Dependency array, When zipcode changes, React executes the effect's function argument to fetch the weather for the new ZIP code.


    return(
        <>
            <h1>Weather update !</h1>
            <h2>Default zipcode: 61525</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="zipcode">Enter your 5 digit zip code:</label>
                <input type="number" id="zipcode" name="zipcode" min={10000} max={99999} maxLength={10} />
                <button type="submit">Submit</button>
            </form>
            {errmsg.length>0 && <p>Error:{errmsg}</p> }
            {isLoading? (<p>Loading ....</p>)
            :
            (<ol>
            {
                forecast.map((day,index)=>(
                    <li key={index}> High: {day.high}, Low: {day.low}, Desc: {day.desc}</li>
                ))}
            </ol>
            )}
        </>
    );

}
export default App;