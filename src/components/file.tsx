import { useCallback, useEffect, useState } from "react";
import "../App.css";

interface Props {
  tableResult: any;
  setTableResult: any;
  selectedDB: any;
  setSelectedDB: any;
}

// how to map actual tables and such
export default function Selector({
  tableResult,
  setTableResult,
  selectedDB,
  setSelectedDB,
}: Props) {
  let [dbs, setdbs] = useState({});
  let tables = [];

  async function tableSelect(e: React.MouseEvent<HTMLDivElement>) {
    console.log("Table query:", "SELECT * FROM " + e.currentTarget.innerHTML);
    let result = await mysql.queryAPI.makeQuery(
      "SELECT * FROM " + e.currentTarget.innerHTML
    );
    if (Array.isArray(result)) {
      let i = 1;
      for (let element of result) {
        if ("id" in result) {
          break;
        }
        element.id = i++;
      }
      setTableResult(result);
    } else {
      setTableResult(result);
    }
  }

  const dbSelect = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      console.log("DB query:", "USE " + e.currentTarget.innerHTML);
      setSelectedDB(e.currentTarget.innerHTML);
      let result = await mysql.queryAPI.makeQuery(
        "USE " + e.currentTarget.innerHTML
      );
      console.log(result);
    },
    [setSelectedDB]
  );

  useEffect(() => {
    const fetchData = async () => {
      let temp_dbs = {};
      try {
        temp_dbs = await mysql.dbTableAPI.getDbTableInfo();
        for (let key in temp_dbs) {
          tables = await mysql.tableAPI.getTableInfo(key);
          if (tables !== "err") {
            temp_dbs[key] = tables.map(
              (table: Object) => table["Tables_in_" + key]
            );
          }
        }
        setdbs(temp_dbs);
      } catch (error) {
        console.log("Error fetching database and table info:", error);
      }
    };
    fetchData();
  }, [tableResult]);

  return (
    <div className="side-column" id="fileList">
      {Object.keys(dbs).map((property) => (
        <div key={property}>
          {property === selectedDB && (
            <div onClick={dbSelect} className="file-option-db-selected">
              {property}
            </div>
          )}
          {property !== selectedDB && (
            <div onClick={dbSelect} className="file-option-db">
              {property}
            </div>
          )}
          {dbs[property].map((item: string) => (
            <div key={item} onClick={tableSelect} className="file-option">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
