FROM docker.elastic.co/elasticsearch/elasticsearch:8.19.24
RUN bin/elasticsearch-plugin install --batch analysis-nori
