import axios from "../../utils/axios";
import { Housing } from "./interfaces";

export async function getRoommates(
  api_housing_url: string,
  setColocs,
  setData
): Promise<void> {
  axios
    .get(api_housing_url)
    .then((res) => {
      // For some reason, doubles Axios roommates which have more than one inhabitant,
      // so we have to do this mess to filter everything.
      // Hours wasted: 2
      var uniqueIds: number[] = [];
      let dataBuffer = res.data.filter((e, i) => {
        if (!uniqueIds.includes(e.id)) {
          uniqueIds.push(e.id);
          return true;
        }
        return false;
      });
      // Here, we avoid problems with roommates in the same building
      // (on different floors for example)
      // If two roommates are on the same coordinates, we shift them slightly so they don't overlap.
      let i = 0,
        j = 0;
      for (i = 0; i < dataBuffer.length; i++) {
        for (j = i + 1; j < dataBuffer.length; j++) {
          if (dataBuffer[i].longitude === dataBuffer[j].longitude) {
            dataBuffer[j].longitude += 0.00001;
          }
        }
      }
      setColocs(
        dataBuffer.map((housing: Housing) => {
          housing.address = housing.address.replace(
            ", 44100 Nantes, France",
            ""
          );
          return { label: housing.roommates.name, housing: housing };
        })
      );
      setData(dataBuffer);
    })
    .catch((err) => {
      setData([]);
    });
}
