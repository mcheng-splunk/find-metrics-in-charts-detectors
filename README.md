# Search `Metrics` in `Charts` or `Detectors` .  


This script performs search for a list of metrics across the `Charts` or `Detectors` based on the user token.

----------------------

## Getting Started

1. Configure the `.env` with the Splunk Observability TOKEN and REALM information 
```
TOKEN = '<token>' 
REALM = '<realm'
```

2. Update the sample.csv with the metrics to filter
```
dog, cat, monkey, pig, k8s.node.name, dragon
```
3. Install all the dependencies

```
cd find-metrics-in-charts-detectors 
npm install
```
4. To Run

```
node metadata.js [chart|detector] [csv_file]
```

- [chart|detector] - to run the script to search against charts or detectors </p>
- [csv_file] - location of another external csv file. Default will use the inbuilt sample.csv file.


*Note*</p>
Script is built and tested  
```
node -v 
v16.18.0
```

----------------------

## Sample Output

Running check against detectors
```  
node metadata.js detector
Following detectors are using the filter dimension: dog, cat, monkey, pig, k8s.node.name, dragon
Search has not found matching filter in detector
******* Id:"FeQwOVOAwAQ" - Name:"[IM Template]: Service POD health - Restarts" - Filter:k8s.node.name
******* Id:"FeQwIS2AwAA" - Name:"[IM Template]: Service POD health - Memory utilization" - Filter:k8s.node.name
******* Id:"FeQwLr2A0AA" - Name:"[IM Template]: Service POD health - Crashes" - Filter:k8s.node.name
******* Id:"FeQwAbVA0AE" - Name:"[IM Template]: Service NODE health - Disk Utilization" - Filter:k8s.node.name
******* Id:"FeQv9OqAwAA" - Name:"[IM Template]: Service POD health - CPU utilization" - Filter:k8s.node.name
```


Running check against charts with external csv file.
```
node metadata.js chart /tmp/sample.csv 
Following charts are using the filter dimension: dog, cat, monkey, pig, horse, tiger, dragon
Search has not found matching filter in chart
```

