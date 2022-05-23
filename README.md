# BTrack Dynamic Asset Managment System using Active RFID and Active Beacons 

# About the Product
1. BTrack is an asset management and tracking product based on Active and Passive RFID. 
2. BTrack is one stop solution for Complete Industrial/Commercial Asset Managment System.

Target Problem:

Industries and Enterpise firm/companies manages their asset using various legacy and modern methods of technologies, this methods often uses technologies like 
hand-held scanner, legacy pen-and-paper logs, human security inception and QR & Barcode based tracking. Some of this technologies consists major serious issues such as:
1. No Digital track of asset.
2. No Remote tracking application.
3. In-house Server's or On-premises Server. This incrases risk of data security.
4. No Live movement tracking.
5. Lack of dynamic alert system.
6. No Automated process from aseet registration till delivery.
7. Tags or Barcode lacks security that can be hacked(changing tags details or barcode details using tags/barcode writer device).
8. Lack proper dynamic Dashboard.
9. No Cloud Backup.
10. No Cloud application and dynamic on-prenise to cloud load balancer.
11. Cannot be integrated into any system such as SAP, Azure, AWS or GCP

Solution to the problem:
1. Active RFID based tracking and monitoring.
2. IoT based RFID device that can be tracked and monitored anywhere from the world.
3. In-house and Azure based Servers. Best in class Azure network rules and policies.
4. Live movement tracking from starting point to destination.
5. Well defined automation system keeps track of each indivisual asset using AI.
6. Alerts system such as Email, SMS, IoT Alert, smart devices, Google Assistant(integration), Digital Display boards.
7. Self analysing application that manages and automates program even if the readers are disconnected.
8. Master Web Application, Web App that provides Asset Management, Asset Tracking, Live Dashboard, Approval System, Third Party Integration such as SAP, MS-SQLSERVER and etc.
9. Various types of Active Rfid tags are tagged accroding to the type of Asset such as Plastic, Steel, Metal, Water-based, Static-Sensitive.
10. Web Applcation backed by best in class nginx web server and Azure Backup Server.
11. Highly-Benchmarked Web Server and Server side program that can handle 255-350 readers operation at a time.
12. High efficient and low latency upto 0.4 sec server response time for each reader connected to Server.
13. Provision to configure RFID Readers with server using Mesh and Hybrid Arrangement.
14. Active Beacon based tracking for asset that are on frequent moment such as Hospital bed, Testing equipment, projectors and etc.
15. Live Dashboard for both Beacon and Active RFID setup.   


## File Details:
folder "testing": all testing and sample files.
folder "rfid_reader": Library package for reader.

Master file: main.py
 - The master file is a class, contain scan,tag approval, sending data via mqtt, reader status and many more. 

## Run Method:
object = Reader1("192.168.0.250",27011,"127.0.0.1","reader/library")

## Simple Usage
First, Import Library to your project 
```
from rfid-reader import RFIDReader

# iniate
reader = RFIDReader('socket', host="10.5.50.200", port=6000, addr="00")

#connect
reader.connect()
```

- Get Reader Information
for get reader information such as type, max freq, etc
```
info = reader.getInfo()
print("INFO ", info)
```
- Scan Tag
```
#scan single tag
tag = reader.scantag()
print('tag', tag)
#output: e200001b29xxx

#scan bulk tag
tags = rfid.scantags()
#output: [e200001b29xxx, e20005b29xxx]

```

# Other Method

| Command                           | Desc |
|-------------------------          |------|
| `getInfo`                         | Get reader information    |
| `getWorkMode`                     | get work mode    |
| `scantag` / `singleInventory`     |     |
| `scangs` / `inventory`            |     |
| `setFrequency`                    |     |
| `setAddress`                      |     |
