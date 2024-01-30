/* eslint-disable react/prop-types */
import React from 'react'
import { CCard, CCardHeader, CCardBody, CNavLink } from '@coreui/react-pro'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api'
import { ProBadge } from 'src/components'

// To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app
const apiKey = 'AIzaSyASyYRBZmULmrmw_P9kgr7_266OhFNinPA'

const defaultZoom = 11
const defaultCenter = { lat: 37.431489, lng: -122.163719 }
const locations = [
  {
    lat: 37.431489,
    lng: -122.163719,
    label: 'S',
    draggable: false,
    title: 'Stanford',
    www: 'https://www.stanford.edu/',
  },
  {
    lat: 37.394694,
    lng: -122.150333,
    label: 'T',
    draggable: false,
    title: 'Tesla',
    www: 'https://www.tesla.com/',
  },
  {
    lat: 37.331681,
    lng: -122.0301,
    label: 'A',
    draggable: false,
    title: 'Apple',
    www: 'https://www.apple.com/',
  },
  {
    lat: 37.484722,
    lng: -122.148333,
    label: 'F',
    draggable: false,
    title: 'Facebook',
    www: 'https://www.facebook.com/',
  },
]

const MarkerList = () => {
  return locations.map((location, index) => {
    return <MarkerWithInfoWindow key={index.toString()} location={location} />
  })
}

const MarkerWithInfoWindow = ({ location }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Marker
      onClick={() => setIsOpen(!isOpen)}
      position={location}
      title={location.title}
      label={location.label}
    >
      {isOpen && (
        <InfoWindow onCloseClick={() => setIsOpen(false)}>
          <CNavLink href={location.www} target="_blank">
            {location.title}
          </CNavLink>
        </InfoWindow>
      )}
    </Marker>
  )
}

const GoogleMapsComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  return (
    isLoaded && (
      <GoogleMap mapContainerStyle={{ height: `400px` }} center={defaultCenter} zoom={defaultZoom}>
        {<MarkerList locations={locations} />}
        <></>
      </GoogleMap>
    )
  )
}

const GoogleMaps = () => {
  return (
    <CCard>
      <CCardHeader>
        React Google Maps <ProBadge />
      </CCardHeader>
      <CCardBody>
        <GoogleMapsComponent />
      </CCardBody>
    </CCard>
  )
}

export default GoogleMaps
