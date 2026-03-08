# Dockerfile for Spring Boot Application (Backend)

# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (caches this layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create a minimal runtime image containing only the built JAR
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the JAR file from the 'build' stage
COPY --from=build /app/target/wellness-*-SNAPSHOT.jar ./app.jar

# Expose the internal port the Spring Boot app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
