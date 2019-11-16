# Readme

1. This is boiler-plate code for Zookeeper config. (It written in java)
2. In this we start zookeeper, then one/many broker's' and create topics.
3. We can use this set-up to run zookeeper, We can also download setup from Apache kafka download site, it is the same. (<https://dzone.com/articles/installing-and-running-kafka-on-an-aws-instance).>
4. This setup is prone to many error and needs extensive debugging, google is your friend.
5. The common things that will go wrong is topic errors, deleting them will solve the issues.
6. how to delete, a. soft delete (delete command), b. hard delete (from dataDir in config/zookeper.properties) and (from log.dirs in config/server.properties).
7. In the scenario using it we have to use it with two other servers, Facade Backend and Kafka-BackEnd. (<https://drive.google.com/file/d/1L8RcXEan53Ds-a4roiwSDYx5gVbwp6xT/view?usp=sharing).>

```alias zoo1="bin/zookeeper-server-start.sh config/zookeeper.properties &"
alias zoo2="bin/kafka-server-start.sh config/server.properties &"
alias zoo3="bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-fac
tor 1 --partitions 1 --topic post_book"
alias zoo4="bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-fac
tor 1 --partitions 1 --topic response_topic"
alias zoo5="bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-fac
tor 1 --partitions 1 --topic user"
alias zoo6="bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-fac
tor 1 --partitions 1 --topic restaurant"
alias zoo6="bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-fac
tor 1 --partitions 1 --topic order"
alias zoo7="bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-fac
tor 1 --partitions 1 --topic restaurant"
alias del="bin/kafka-topics.sh --zookeeper localhost:2181 --delete --topic"
alias lt="bin/kafka-topics.sh --list --zookeeper localhost:2181"
alias sh="lsof -i:2181"
```
