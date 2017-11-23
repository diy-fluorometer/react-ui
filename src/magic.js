export default function(calibrationValues, luxInput) {
  console.log('lux input : ' + luxInput);
  var x_bar = 0;
  var y_bar = 0;
  var tmp1 = 0;
  var tmp2 = 0;
  var alpha, beta;

  //calibrationValues = [2.2, 5.8, 10.2, 11.8];
  console.log('calibrationValues : ' + JSON.stringify(calibrationValues));
  var calibrationDNA = [0, 25, 50, 100];

  for (let i = 0; i < calibrationValues.length ; i++) {
    x_bar = x_bar + calibrationDNA[i];
    y_bar = y_bar + calibrationValues[i];
  }
  x_bar = x_bar / calibrationValues.length;
  y_bar = y_bar / calibrationValues.length;
  
  console.log('x: ' + x_bar);
  console.log('y: ' + y_bar);

  for(let j = 0; j < 4; j++) {
    console.log('looping');
    tmp1 = tmp1 + (calibrationDNA[j] - x_bar)*(calibrationValues[j]-y_bar);
    tmp2 = tmp2 + (calibrationDNA[j] - x_bar)**2;
  }
  console.log('t1: ' + tmp1);
  console.log('t2: ' + tmp2);
  beta = tmp1 / tmp2;
  alpha = y_bar - beta*x_bar;

  return (luxInput - alpha) / beta;
}
