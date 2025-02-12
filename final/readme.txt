#Installing K6 
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Running mqtt server

$ go install go.k6.io/xk6/cmd/xk6@latest
docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.49.0 --with github.com/pmalhaire/xk6-mqtt@v0.40.0
docker run --rm --name mosquitto -d -p 1883:1883 eclipse-mosquitto mosquitto -c /mosquitto-no-auth.conf



#Installing Requirments 
(unix)
xk6 build v0.54.0 \
    --with github.com/pmalhaire/xk6-mqtt@latest \
    --with github.com/avitalique/xk6-file@latest

#(Powershell)
xk6 build v0.54.0 `
     --with github.com/pmalhaire/xk6-mqtt@latest `
     --with github.com/avitalique/xk6-file@latest


K6_WEB_DASHBOARD=true ./k6 run --duration 3m --vus 3  devices.js  # running the scenario (unix)
$env:K6_WEB_DASHBOARD="true"; ./k6 run --duration 3m --vus 3 Device_test.js # running the scenario (windows)

node JsonFormatter // fixing the json file created 

K6_WEB_DASHBOARD=true ./k6 run --duration 3m --vus 3  Mqtt_connection.js // connecting into created devices 


