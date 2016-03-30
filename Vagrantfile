# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX = ENV['BOX_NAME'] || "ubuntu/trusty64"
VAGRANTFILE_API_VERSION = "2"

# *** Modify if more or less CPU/RAM resources required ***
VAGRANT_RAM = ENV['VAGRANT_RAM'] || 1024
VAGRANT_CORES = ENV['VAGRANT_CORES'] || 2

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = BOX

  config.vm.define "consul1" do |consul|
    consul.vm.hostname = "consul1"
    consul.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provision "docker" do |docker|
      docker.pull_images "progrium/consul"
    end
    consul.vm.provision "shell", inline:
     "sudo mkdir -p /opt/consul
     docker stop $(docker ps -a -q)
     docker rm $(docker ps -a -q)
     $(docker run --rm progrium/consul cmd:run 192.168.33.10 -d)"
  end

  config.vm.define "consul2" do |consul|
    consul.vm.hostname = "consul2"
    consul.vm.network "private_network", ip: "192.168.33.11"
    config.vm.provision "docker" do |docker|
      docker.pull_images "progrium/consul"
    end
    consul.vm.provision "shell", inline:
     "sudo mkdir -p /opt/consul
      docker stop $(docker ps -a -q)
      docker rm $(docker ps -a -q)
      $(docker run --rm progrium/consul cmd:run 192.168.33.11::192.168.33.10 -d -v /opt/consul:/data)"
  end

  config.vm.define "consul3" do |consul|
    consul.vm.hostname = "consul3"
    consul.vm.network "private_network", ip: "192.168.33.12"
    config.vm.provision "docker" do |docker|
      docker.pull_images "progrium/consul"
    end
    consul.vm.provision "shell", inline:
     "
     docker stop $(docker ps -a -q)
     docker rm $(docker ps -a -q)
     sudo mkdir -p /opt/consul
     docker stop $(docker ps -a -q)
     docker rm $(docker ps -a -q)
     $(docker run --rm progrium/consul cmd:run 192.168.33.12::192.168.33.10 -d -v /opt/consul:/data )"
  end

  config.vm.define "gateway" do |gateway|
    gateway.vm.hostname = "gateway"
    gateway.vm.network "private_network", ip: "192.168.33.13"
    gateway.vm.provision "docker" do |docker|
      docker.pull_images "progrium/consul"
      docker.pull_images "gliderlabs/registrator"
      docker.pull_images "philipgough/consul-gateway-service"
    end
    gateway.vm.provision "shell", inline:
     "
     docker stop $(docker ps -a -q)
     docker rm $(docker ps -a -q)
     $(docker run --rm progrium/consul cmd:run 192.168.33.13::192.168.33.10::client -d)
      docker run -d \
      --name=registrator \
      --volume=/var/run/docker.sock:/tmp/docker.sock \
      gliderlabs/registrator:latest \
      -ip 192.168.33.13 \
      consul://192.168.33.13:8500
      docker tag philipgough/consul-gateway-service consul-gateway-service
      docker run -P -d consul-gateway-service"
  end

   config.vm.define "services" do |services|
    services.vm.hostname = "services-node"
    services.vm.network "private_network", ip: "192.168.33.14"
    services.vm.provision "docker" do |docker|
      docker.pull_images "gliderlabs/registrator:latest"
      docker.pull_images "philipgough/icon-service"
      docker.pull_images "philipgough/random-number-service"
    end
    services.vm.provision "shell", inline:
     "
     docker stop $(docker ps -a -q)
     docker rm $(docker ps -a -q)
     $(docker run --rm progrium/consul cmd:run 192.168.33.14::192.168.33.10::client -d)
     docker run -d \
     --name=registrator \
     --volume=/var/run/docker.sock:/tmp/docker.sock \
     gliderlabs/registrator:latest \
     -ip 192.168.33.14 \
     consul://192.168.33.14:8500
     docker tag philipgough/icon-service icon-service
     docker tag philipgough/random-number-service random-number-service
     docker run -P -d random-number-service
     docker run -P -d random-number-service
     docker run -P -d icon-service
     docker run -P -d icon-service"
  end

  config.vm.provider "virtualbox" do |vb|


    # Allow VM to use host OS host and DNS settings
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]

    # VM RAM & CPU settings
    vb.customize ["modifyvm", :id, "--memory", VAGRANT_RAM]
    vb.customize ["modifyvm", :id, "--cpus", VAGRANT_CORES]


  end

end
