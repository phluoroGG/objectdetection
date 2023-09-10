FROM python:3.11
COPY . /app
WORKDIR /app
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
RUN apt-get update && apt-get install libgl1 -y
RUN pip install --no-cache-dir -r requirements.txt

