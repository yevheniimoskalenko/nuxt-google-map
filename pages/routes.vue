<script setup lang="ts">
    import { GoogleMap } from 'vue3-google-map'
    const env = useRuntimeConfig()
    const mapRef = useTemplateRef('mapRef')
    const GMAPS_API_KEY = computed(() => env.public.GMAPS_API_KEY)
    const gmap = ref(null)
    const mapOptions = reactive({
	zoom: 20,
	maxZoom: 10,
	minZoom: 3,
	styles: [],
    })
const directionsRenderer = ref(null)
const center = computed(() => ({ lat: 50.4503596, lng: 30.5245025 }))
    watch(
	() => mapRef.value?.ready,
	(ready) => {
		if (!ready) return
        gmap.value = mapRef.value.map
        directions()
	},
    )
function setDirection(val) {
    directionsRenderer.value = val
}

async function directions() {
	try {
		const request = {
			origin: {lat: 50.44997703171514, lng: 30.521648629608134}, // start point
			destination: {lat: 49.81821975302162, lng: 24.01924069946072}, // end point
			travelMode: 'DRIVING', // trevel mode DRIVING WALKING BICYCLING TRANSIT
		}
		const directionsService = new window.google.maps.DirectionsService()
		await directionsService.route(request, (response, status) => {
			if (status === window.google.maps.DirectionsStatus.OK) {
				if (!directionsRenderer.value) {
					setDirection(new window.google.maps.DirectionsRenderer())
					    directionsRenderer.value.setMap(gmap.value)
                    }
                    directionsRenderer.value.setDirections(response)
			} else {
				console.error('Failed to calculate the route:', status)
			}
		})
	} catch (e) {
        console.log(e)
	}
}
</script>
<template>
    <section>
        <GoogleMap
			ref="mapRef"
			:api-key="GMAPS_API_KEY"
			:options="mapOptions"
			:center="center"
            style="width: 100%; height: 100vh;"
			:zoom="15"
		>
    </GoogleMap>
    </section>
</template>