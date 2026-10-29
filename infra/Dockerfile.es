FROM docker.elastic.co/elasticsearch/elasticsearch:8.19.23
RUN bin/elasticsearch-plugin install --batch analysis-nori
