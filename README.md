#Service Discovery with Consul.io
---------------------------------

This repo contains three seperate Node services in Docker containers

1. Random number service - Returns a random string or number from its sole endpoint
2. dnmonster - Provides a unique monster icon avatar when passed a string (https://github.com/amouat/dnmonster)
3. Gateway service - Acts as a front end and service discovery/load balancing mechanism

### Purpose
---------------
The project demonstrates the use of Consul.io as a service discovery tool. It makes use of Glider Labs Registrator container for third party service registration. See http://gliderlabs.com/registrator

It allows the provisioning of a multi-machine network using Vagrant to dispaly how containers can be scaled across multiple nodes and discovered automatically using these services.

The Gateway service provides a web page which allows the user to generate a random string. The gateway service requets this services location and port number through a DNS SRV request before randomly choosing an instance of the service to make the request to.

The gateway then passes the string to the icon service where a unique monster avatar is returned to the end user. This service is also located using DNS.

The project demonstrates the power of Consul in helping to build a distributed system using a microservices architecture.

### Running the project
-------------------------

Simply clone this project, install Vagrant and run

```
vagrant up
```

It will take a few minutes to spin up the five lightweight virtual machines, at which point you can browse to 192.168.33.10:8500 to view the Consul cluster Web UI.


### Deployment
-----------------

![Deployment/Architecture Diagram](https://github.com/PhilipGough/consul-service-discovery/blob/master/deployment_diagram.png)
