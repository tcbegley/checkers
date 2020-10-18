FROM python:3.8
WORKDIR /checkers/backend
COPY . ./
RUN pip install .

EXPOSE 8000
WORKDIR /checkers
CMD ["gunicorn", "checkers_backend:app", "-b", "0.0.0.0:8000", "-w", "4", "-k", "uvicorn.workers.UvicornWorker"]
