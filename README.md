# About the Project

This is the version 1 of Merchant map. The user can filter between locations, products, categories and cashback options in orders to find merchants in the map.

## Figma Design

https://www.figma.com/design/iSAGJu4482SzJ8eDhZy4P3/Merchant-Map?node-id=0-1&t=TVY2fcbxI6Avj3oz-0

# Getting started

### Run locally

#### Clone git merchants-map-backend repository

#### Start docker desktop

###### Backend project:

#### Clone that project to another webstorm project and run together with this project:

```
git clone https://gitlab.uphellas.gr/up-hellas-dev/map/merchants-map-backend.git
```
####  To run this project, you will need to add the following environment variables to your .env file:

```
MONGO_HOST
MONGO_PORT
MONGO_USER
MONGO_PASSWORD
MONGO_DATABASE
MONGO_COLLECTION
```

#### Run the fist time:

```
docker build -t merchants_map  .
```

#### Run docker

```
docker run -p 80:80 merchants_map
```
###### Frontend project:

####  To run this project, you will need to add the following environment variables to your .env file:

```
GOOGLE_MAPS_API_KEY
```

#### Install Dependencies:

```
yarn install
```
#### Run merchants map

```
yarn run start
```

# Usage

### Basic Components:

#### AppWrapper.tsx
Main layout wrapper, that contains some basic styles and wraps the main MerchantsMap component with API Provider.

#### AppWrapper.tsx
Main layout wrapper, that contains some basic styles and wraps the main MerchantsMap component with API Provider.

#### index.tsx
The main MerchantMap component, that contains all app components and handlers for requests, query params and language.

#### api.tsx
Contains getData async function that get merchantsData response based on query params and getFilters async function that get all possible filter options.

#### Sidebar.tsx
Contains all functionality of filter handling and responsive left and bottom menus.


#### Markers.tsx
Contains all the functionality of markers and clusters handling and rendering.

#### helper.tsx
Contains smoothZoom function in order of smoother transition when markers location change
















