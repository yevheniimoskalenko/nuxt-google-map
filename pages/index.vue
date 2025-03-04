<script setup lang="ts">
import { GoogleMap, Marker, MarkerCluster } from 'vue3-google-map'
interface coordI {
	lat: number
	lng: number
}
interface markerI {
	id: number,
	index: number
	position: coordI,
	draggable: boolean
	visible: boolean
	icon: string
}
const env = useRuntimeConfig()
  const customIconMarker = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
<path d="M30.6067 28.94L20 39.5467L9.39334 28.94C7.29557 26.8422 5.86698 24.1695 5.28821 21.2598C4.70945 18.3501 5.00651 15.3341 6.14183 12.5932C7.27715 9.85232 9.19974 7.50965 11.6665 5.86144C14.1332 4.21323 17.0333 3.3335 20 3.3335C22.9667 3.3335 25.8668 4.21323 28.3335 5.86144C30.8003 7.50965 32.7229 9.85232 33.8582 12.5932C34.9935 15.3341 35.2906 18.3501 34.7118 21.2598C34.133 24.1695 32.7044 26.8422 30.6067 28.94ZM20 25C21.7681 25 23.4638 24.2977 24.7141 23.0474C25.9643 21.7972 26.6667 20.1015 26.6667 18.3334C26.6667 16.5653 25.9643 14.8696 24.7141 13.6193C23.4638 12.3691 21.7681 11.6667 20 11.6667C18.2319 11.6667 16.5362 12.3691 15.286 13.6193C14.0357 14.8696 13.3333 16.5653 13.3333 18.3334C13.3333 20.1015 14.0357 21.7972 15.286 23.0474C16.5362 24.2977 18.2319 25 20 25ZM20 21.6667C19.116 21.6667 18.2681 21.3155 17.643 20.6904C17.0179 20.0653 16.6667 19.2174 16.6667 18.3334C16.6667 17.4493 17.0179 16.6015 17.643 15.9763C18.2681 15.3512 19.116 15 20 15C20.8841 15 21.7319 15.3512 22.357 15.9763C22.9822 16.6015 23.3333 17.4493 23.3333 18.3334C23.3333 19.2174 22.9822 20.0653 22.357 20.6904C21.7319 21.3155 20.8841 21.6667 20 21.6667Z" fill="#009EFF"/>
</svg>`;

const mapRef = useTemplateRef('mapRef')
const markerRef = useTemplateRef('markerRef')
const mapOptions = reactive({
	zoom: 20,
	maxZoom: 10,
	minZoom: 3,
	styles: [],
})

const markers = ref<markerI[]>([])
const center = computed(() => ({ lat: 50.4503596, lng: 30.5245025 }))
	const GMAPS_API_KEY = computed(() => env.public.GMAPS_API_KEY)
	
    watch(
	() => mapRef.value?.ready,
	(ready) => {
		if (!ready) {
			return
		}
		const gmap = mapRef.value.map
		gmap.addListener('bounds_changed', handleBoundsChanged)
	},
    )

function onMapClick (event) {
	const { lat, lng } = event.latLng
	markers.value.push({
		id: markers.value.length,
		index: Date.now(),
		position: {
			lat: lat(),
       	 	lng: lng(),
		},
		draggable: false,
		visible: true,
		icon: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(customIconMarker),
    })
}

function clearMarkers () {
    markers.value = []
}
function handleBoundsChanged () {
  const gmap = mapRef.value.map;
	const bounds = gmap.getBounds();

  if (bounds) {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // console.log('NorthEast:', ne.lat(), ne.lng());
    // console.log('SouthWest:', sw.lat(), sw.lng());
  }
}

function handlerMarker(id: number) {
	const marker = markerRef.value.find(m => m.marker.id === id)
	if (marker) {
		markers.value[marker.marker.id].draggable = !markers.value[marker.marker.id].draggable
		marker.marker.draggable = !marker.marker.draggable
		markers.value[marker.marker.id].index = Date.now()
	}
}

function handleMarkerDrag(id: number) {
	const marker = markerRef.value.find(m => m.marker.id === id)
	if (marker) {
		const { lat, lng } = marker.marker.position
		updateMarker(id, lat(), lng())
		markers.value[id].index = Date.now()
		markers.value[id].index = Date.now()
	}
}

function updateMarker(id:number, lat:number, lng:number) {
	const marker = markerRef.value.find(m => m.marker.id === id)
	if (marker) {
		markers.value[id].position = { lat, lng }
		marker.marker.position = { lat, lng }
		markers.value[id].index = Date.now()
	}
}

</script>
<template>
<section>
    <div>
        <button @click="clearMarkers">Clear Markers</button>
    </div>
		<GoogleMap
			ref="mapRef"
			:api-key="GMAPS_API_KEY"
			:options="mapOptions"
			:center="center"
            style=" width: 100%; height: 100vh;"
			:zoom="15"
			@click="onMapClick"
		>
		<MarkerCluster>
			<Marker
				v-for="marker in markers"
				ref="markerRef"
				:key="marker.index"
				:options="marker"
				@dblclick="handlerMarker(marker.id)"
				@dragend="handleMarkerDrag(marker.id)"
			/>
		</MarkerCluster>
    </GoogleMap>
</section>
</template>