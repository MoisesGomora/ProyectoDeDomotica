var http = require('http').createServer(handler); //importamos la biblioteca http, creamos la instancia
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //creo una instancia GPIO
var LED = new Gpio(17, 'out'), //use declare variables for all the GPIO output pins
  LED2 = new Gpio(27, 'out'),
  LED3 = new Gpio(22,'out'),
  LED4 = new Gpio(5,'out'),
  LED5 = new Gpio(6,'out'),
  LED6 = new Gpio(13,'out'),
  LED7 = new Gpio(19,'out'),
  LED8 = new Gpio(26,'out');
var pushButton = new Gpio(4, 'in', 'falling'); //creamos una instancia pushbotton use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
//configuramos insterrupciones para ambos casos
http.listen(8080); //listen to port 8080, se queda esperando
function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index2.html', function(err, data) { //ruta del archivos, usamos el direname para no poner todo read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //error 404
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //le enviamos al cliente el html
    return res.end();
  });
}
LED.writeSync(1);
LED2.writeSync(1);
LED3.writeSync(1);
LED4.writeSync(1);
LED5.writeSync(1);
LED6.writeSync(1);
LED7.writeSync(1);
LED8.writeSync(1);
const Serialport = require('serialport');

const Readline = Serialport.parsers.Readline;

const port = new Serialport('/dev/ttyACM0',{
    baudRate: 9600
});

const parser = port.pipe(new Readline({ delimeter: '/r/n'}));
parser.on('open',function(){
    console.log('connection is opened');
});

parser.on('data',function(data){
    io.emit('temp',data);
});

port.on('error',function(err){
    console.log(err);
});
//timbre
io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    lightvalue = value;
    socket.emit('Timbre', lightvalue); //send button status to client
  });
});
//casa
io.sockets.on('connection', function (socket) {// interrupcion por socketWebSocket Connection
  socket.on('domo', function(data) { //en caso de que se resiva un mensaje del socket get light switch status from client
    switch(data){
      case '0000':
        LED.writeSync(0);
        break;
      case '0001':
        LED.writeSync(1);
        break;
      case '0010':
        LED2.writeSync(0);
        break;
      case '0011':
        LED2.writeSync(1);
        break;
      case '0100':
        LED3.writeSync(0);
        break;
      case '0101':
        LED3.writeSync(1);
        break;
      case '0110':
        LED4.writeSync(0);
        break;
      case '0111':
        LED4.writeSync(1);
        break;
      case '1000':
        LED5.writeSync(0);
        break;
      case '1001':
        LED5.writeSync(1);
        break;
      case '1010':
        LED6.writeSync(0);
        break;
      case '1011':
        LED6.writeSync(1);
        break;
      case '1100':
        LED7.writeSync(0);
        break;
      case '1101':
        LED7.writeSync(1);
        break;
      case '1110':
        LED8.writeSync(0);
        break;
      case '1111':
        LED8.writeSync(1);
        break;
      case 'O':
        port.write('C');
        break;
      case 'C':
        port.write('A');
        
    }
  });
});

process.on('SIGINT', function () { //on ctrl+c
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});