var express = require('express');

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "34.135.231.137",
  user: "root",
  password: "password",
  database: "flight_delay_data"
});

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.get('/search', function (req, res) {
  let data = req.query;

  con.query(`SELECT COUNT(*) FROM flights WHERE origin LIKE "${data.query}"`, function (err, result, fields) {
    if (err) throw err;
    let values = Object.values(JSON.parse(JSON.stringify(result)));
    console.log(values[0]['COUNT(*)']);
    return res.json({ count: values[0]['COUNT(*)']});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.get('/insert', function (req, res) {
  let data = req.query;

  con.query(`INSERT INTO airlines VALUES ('${data.code}', '${data.name}');`, function (err, result, fields) {
    if (err) throw err;
    // let values = Object.values(JSON.parse(JSON.stringify(result)));
    // console.log(vaules);
    // console.log(values[0]['COUNT(*)']);
    // return res.json({ count: values[0]['COUNT(*)']});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.get('/update', function (req, res) {
  let data = req.query;

  con.query(`UPDATE airlines SET iata_code='${data.code}', airline='${data.name}' WHERE iata_code='${data.ocode}' AND airline='${data.oname}';`, function (err, result, fields) {
    if (err) throw err;
    // let values = Object.values(JSON.parse(JSON.stringify(result)));
    // console.log(vaules);
    // console.log(values[0]['COUNT(*)']);
    // return res.json({ count: values[0]['COUNT(*)']});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.get('/delete', function (req, res) {
  let data = req.query;

  con.query(`DELETE FROM airlines WHERE iata_code='${data.code}' AND airline='${data.name}';`, function (err, result, fields) {
    if (err) throw err;
    // let values = Object.values(JSON.parse(JSON.stringify(result)));
    // console.log(vaules);
    // console.log(values[0]['COUNT(*)']);
    // return res.json({ count: values[0]['COUNT(*)']});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.get('/adv1', function (req, res) {
  let data = req.query;

  con.query(`SELECT a.iata_code
  FROM airports a JOIN flights f ON (a.iata_code = f.origin)
  WHERE a.iata_code IN (SELECT iata_code FROM airports a1 JOIN flights f1 ON
  (a1.iata_code = f1.origin) GROUP BY a1.iata_code HAVING AVG(arrivaldelay)
  > AVG(departdelay))
  GROUP BY a.iata_code
  ORDER BY AVG(arrivaldelay) DESC
  LIMIT ${data.limit};`, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    var str = "";
    result.forEach(element => {
      str += element.iata_code + " ";
    });
    console.log(str);
    res.send({finalstr: str});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.get('/adv2', function (req, res) {
  let data = req.query;

  console.log("adv2 called");

  con.query(`SELECT a.iata_code, a.airport, COUNT(f.destination) as countdest
  FROM airports a JOIN flights f ON (a.iata_code = f.origin)
  GROUP BY a.iata_code
  ORDER BY countdest DESC
  LIMIT ${data.limit};`, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    var str = "";
    result.forEach(element => {
      str += element.iata_code + " ";
    });
    console.log(str);
    res.send({finalstr: str});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.get('/proc', function (req, res) {
  let data = req.query;

  console.log("proc called");

  con.query(`CALL Result;`, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    var str = "";
    var element = result[0];
    // console.log(element);
    for (var i = 0; i < parseInt(data.limit); i++) { str += element[i].iata_code + " "; }
    // element.forEach(e => {
    //   console.log(e);
      
    // });
    console.log(str);
    res.send({finalstr: str});
  });
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

// let delcode = document.getElementById("delcode").value;
// let delnum = document.getElementById("delnum").value;
// let delo = document.getElementById("delo").value;
// let deld = document.getElementById("deld").value;
// let delmon = document.getElementById("delmon").value;
// let delday = document.getElementById("delday").value;
// let delyear = document.getElementById("delyear").value;
// let delflnum = document.getElementById("delflnum").value;

app.get('/addflight', function (req, res) {
  var id = 0;
  con.query(`SELECT flightid FROM flights ORDER BY flightid DESC LIMIT 1`, function (err, result, fields) {
    if (err) throw err;
    let values = Object.values(JSON.parse(JSON.stringify(result)));
    console.log(values[0]['flightid']);
    id = values[0]['flightid'];
    con.query(`INSERT INTO flights VALUES (${id + 1}, '${data.delcode}', '${data.delnum}', '${data.delo}', '${data.deld}', ${data.delmon}, ${data.delday}, ${data.delyear}, ${data.delflnum}, '${data.delddel}', '${data.deladel}', 0, 3, 0);`, function (err, result, fields) {
      if (err) throw err;
      // let values = Object.values(JSON.parse(JSON.stringify(result)));
      // console.log(vaules);
      // console.log(values[0]['COUNT(*)']);
      // return res.json({ count: values[0]['COUNT(*)']});
    });
  });

  let data = req.query;
  // res.sendStatus(200);

  // console.log(count);
  // return res.send(count);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/**
DELIMITER //
CREATE TRIGGER newTrig BEFORE INSERT ON flights FOR EACH ROW
BEGIN
    SET @arr = (SELECT AVG(ABS(arrivaldelay)) FROM flights WHERE destination = NEW.destination);
    SET @dep = (SELECT AVG(ABS(departdelay)) FROM flights WHERE origin = NEW.origin);
    SET @arrstd = (SELECT STDDEV(ABS(arrivaldelay)) FROM flights WHERE destination = NEW.destination);
    SET @depstd = (SELECT STDDEV(ABS(departdelay)) FROM flights WHERE origin = NEW.origin);
    
    IF ABS(NEW.arrivaldelay) > @arr + (3 * @arrstd) THEN
      SET NEW.arrivaldelay = 0;
    END IF;

    IF ABS(NEW.departdelay) > @dep + (3 * @depstd) THEN
      SET NEW.departdelay = 0;
    END IF;
END //
DELIMITER ;
 */

/**
 * find the worst airports (ones with least delay)
DELIMITER //
CREATE PROCEDURE Result()
BEGIN DECLARE variata VARCHAR(255);
DECLARE vardelay INT;
DECLARE vararriv INT;
DECLARE exit_loop BOOLEAN DEFAULT FALSE;

DECLARE myCur CURSOR FOR (SELECT a.iata_code, SUM(ABS(f.departdelay)) AS sumdel
    FROM airports a JOIN flights f ON (a.iata_code = f.origin)
    GROUP BY a.iata_code
    ORDER BY sumdel DESC);

DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;
DROP TABLE IF EXISTS FinalTable;
      
CREATE TABLE FinalTable (
  iata_code VARCHAR(256) PRIMARY KEY,
  sumdel INT,
  sumarr INT
);

  OPEN myCur;
    cloop: LOOP
  FETCH myCur INTO variata, vardelay;
  IF exit_loop THEN
      LEAVE cloop;
  END IF;

  IF vardelay >= 50 THEN
    SET vararriv = (SELECT (SUM(ABS(f.arrivaldelay))) FROM flights f WHERE f.destination = variata GROUP BY f.destination);
    INSERT INTO FinalTable VALUES(variata, vardelay, vararriv);
  END IF;

  END LOOP cloop;
  CLOSE myCur;

  SELECT * FROM FinalTable ORDER BY sumarr DESC, sumdel DESC;
END //
DELIMITER ;
*/