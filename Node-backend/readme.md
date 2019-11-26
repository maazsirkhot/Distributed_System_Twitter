# NodeBackEnd

1. This is first part of Entry from backend.
2. There is no need of Mongo in this set-up but I haven't completed the migration to Kafka fully so, Mongo has to be here too. Otherwise mongo can be only in kafka backend.  
3. In the scenario below, user topic is produced by node backend and consumed by put to kafka, and then consumed by Kafka Backend.
  And response topic is produced by Kafka backend and put to kafka and then consumed by Node backend.
  ![Alt text](images/KafkaWorkingFullAtchitechture.png?raw=true "Title")
  