<script setup lang="ts">
import { GoogleMap, Marker } from 'vue3-google-map'
const env = useRuntimeConfig()

const mapRef = useTemplateRef('mapRef')
const markerRef = useTemplateRef('markerRef')
const mapOptions = ref({
	zoom: 20,
	maxZoom: 10,
	minZoom: 3,
	styles: [
		{
			// featureType: 'poi',
			// elementType: 'all',
			// stylers: [{ visibility: 'off' }], hide shop
		},
	],
})

const markers = ref([])

const center = computed(() => ({ lat: 50.4503596, lng: 30.5245025 }))
    const GMAPS_API_KEY = computed(() => env.public.GMAPS_API_KEY)

    watch(
	() => mapRef.value?.ready,
	(ready) => {
		if (!ready) {
			return
		}
		const gmap = mapRef.value.map
		Object.assign(gmap, {
			// disableDefaultUI: true,
			// scaleControl: false,
			// fullscreenControl: false,
			// navigationControl: false,
			// mapTypeControl: false,
			// streetViewControl: false,
			// zoomControl: false,
			// rotateControl: false,
		})
		// gmap.addListener('bounds_changed', handleBoundsChanged)
	},
    )

const onMapClick = (event) => {
	const { lat, lng } = event.latLng
    markers.value.push({
        lat: lat(),
        lng: lng(),
    })
}

</script>
<template>
<section>
		<GoogleMap
			ref="mapRef"
			:api-key="GMAPS_API_KEY"
			:options="mapOptions"
			:center="center"
            style=" width: 100%; height: 100vh;"
			:zoom="15"
			@click="onMapClick"
		>
            <Marker
				v-for="marker in markers"
				ref="markerRef"
				:key="marker.id"
				:options="{
					position: {
						lat: marker.lat,
						lng: marker.lng,
					},
				}"
			/>
    </GoogleMap>
</section>
</template>