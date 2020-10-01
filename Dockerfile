FROM python:3.8
WORKDIR /checkers

WORKDIR /checkers/lib
COPY lib ./
RUN pip install .

WORKDIR /checkers/backend
COPY backend ./
RUN pip install .

EXPOSE 8000
WORKDIR /checkers
CMD ["uvicorn", "checkers_backend:app", "--host", "0.0.0.0", "--port", "8000"]
