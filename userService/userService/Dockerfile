
FROM openjdk:17-jdk-alpine
# Directorio de trabajo dentro del contenedor
WORKDIR /app

COPY . .
RUN ./gradlew build -x test


# Copiar el archivo JAR construido en el directorio de trabajo
COPY build/libs/*.jar app.jar

# Comando para ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "app.jar"]