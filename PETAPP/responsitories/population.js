// population.js
import axios from "axios";

const Server = 'datausa.io';
export const getPopulation = async ({ drilldowns, measures }) =>  {
    const urlGetPopulation = `https://${Server}/api/data?drilldowns=${drilldowns}&measures=${measures}`;
    try {
        let result = [];
        let responseData = await axios.get(urlGetPopulation);
        responseData.data.data.forEach(function (item) {
            let myObject = {};
            myObject.nationId = item['ID Nation'];
            myObject.nationName = item['Nation'];
            myObject.year = item['Year'];
            myObject.population = item['Population'];
            result.push(myObject);
        });
        return result;
    } catch (error) {
        throw error;
    }
}