<template>
  <div id="Gmaps">
    <remote-js js-url="http://img.intelirri.com/Fqsb1fHmFpzhWpEvrB9IAhGH6QL3" :js-load-call-back="loadRongJs" />
  </div>
</template>
<script>
import RemoteJs from './components/remote'
export default {
  components: { RemoteJs },
  props: {
    mapData: {
      type: Object,
      required: true
    }
  },
  methods: {
    loadRongJs() {
      var options = {
        zoom: this.mapData.zoom,
        center: { lat: this.mapData.lat, lng: this.mapData.lng },
        mapTypeId: 'hybrid',
        gestureHandling: 'greedy'
      }
      // eslint-disable-next-line no-undef
      new google.maps.Map(document.getElementById('Gmaps'), options)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #Gmaps {
    width: 100%;
    height: 100%;
  }
</style>
