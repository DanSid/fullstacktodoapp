FROM mongo:7.0

# Copy initialization scripts
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Create data directory
RUN mkdir -p /data/db

# Expose MongoDB port
EXPOSE 27017

# Set default command
CMD ["mongod", "--bind_ip_all"]
