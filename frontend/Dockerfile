# build environment
FROM node:14-alpine as build
ARG CHECKERS_BACKEND="localhost:8000"
WORKDIR /checkers/frontend
COPY package* ./
RUN npm ci --silent
COPY . ./
ENV PATH /checkers/frontend/node_modules/.bin:$PATH
RUN CHECKERS_BACKEND=${CHECKERS_BACKEND} npm run build

FROM nginx:alpine
COPY --from=build /checkers/frontend/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
