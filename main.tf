terraform {
  required_version = ">= 1.0.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

variable "do_token" {
  description = "DigitalOcean API Token"
  type        = string
  sensitive   = true
}





variable "droplet_name" {
  description = "Name of the DigitalOcean Droplet"
  type        = string
  default     = "k6-slave"
}

variable "region" {
  description = "DigitalOcean Region"
  type        = string
  default     = "nyc3"  # Change this based on your location
}

variable "size" {
  description = "Droplet Size"
  type        = string
  default     = "s-2vcpu-4gb"  # 2 vCPUs, 4GB RAM
}

variable "image" {
  description = "Base Image for Droplet"
  type        = string
  default     = "ubuntu-22-04-x64"
}

# Create the VM on DigitalOcean
resource "digitalocean_droplet" "k6_slave" {
  name   = var.droplet_name
  region = var.region
  size   = var.size
  image  = var.image
#   ssh_keys = [var.ssh_key]

#   provisioner "remote-exec" {
#     connection {
#       type        = "ssh"
#       user        = "root"
#       private_key = file("~/.ssh/id_rsa")
#       host        = self.ipv4_address
#     }

#     inline = [
#       "apt update -y",
#       "apt install -y ansible"
#     ]
#   }
}

# Output the assigned IP address
output "droplet_ip" {
  value = digitalocean_droplet.k6_slave.ipv4_address
}

