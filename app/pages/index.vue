<script setup>
import { useHead } from '#imports'
import { watch, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from '#imports'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../stores/filters'
import { animations } from '../stores/animations'
import { swipe } from '../stores/swipe'


useHead({
  title: 'Terméklista - Voxinfo',
  meta: [
    { name: 'description', content: 'Voxinfo termékek listája, jármű, időtartam és ország szerint szűrhető.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Terméklista - Voxinfo' },
    { property: 'og:description', content: 'Voxinfo termékek listája, jármű, időtartam és ország szerint szűrhető.' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
    {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap'}
  ]
})

const route = useRoute()
const router = useRouter()

const store = useProductsStore()
const { products, page, limit, maxProducts, vehicleClass, duration, country, sort, sortOrder, search} = storeToRefs(store)

if (route.query._page) store.page = route.query._page
if (route.query.vehicle) store.vehicleClass = route.query.vehicle
if (route.query.duration) store.duration = route.query.duration
if (route.query._order) store.sortOrder = route.query._order
if (route.query._sort) store.sort = route.query._sort
if (route.query.country) store.country = route.query.country
if (route.query.q) store.search = route.query.q

let debounceTimeout = null

watch(() => store.search, (newValue) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    store.page = 1
    store.fetchProducts()
  }, 300)
})

// Frissítjük az URL-t
watch([page, vehicleClass, duration, country, sort, sortOrder, search], ([newPage, newVehicle, newDuration, newCountry, newSort, newSortOrder, newSearch]) => {
  router.replace({ query: { ...route.query, _page: newPage, _limit: limit.value, vehicle: newVehicle || undefined, duration: newDuration || undefined, country: newCountry || undefined, _sort: newSortOrder ? "price" : undefined, _order: newSortOrder || undefined, q: newSearch || undefined } })
})

function vehicleFilter(value) {
  store.page = 1
  store.vehicleClass = value
}

function durationFilter(value, element) {
  store.page = 1
  if (store.duration === value) {
    element.target.classList.remove('active')
    store.duration = ''
  } else {
    const previous = document.querySelector('.duration-filter .active')
    if (previous) previous.classList.remove('active')
    element.target.classList.add('active')
    store.duration = value
  }
}

onMounted(() => swipe())
onMounted(() => animations())
watch(() => store.products, async () => {
  await nextTick()
  animations()
})


</script>

<template>
  <section class="products">
    <div class="filter-bar1">
      <img src="/favicon.ico"/>
      <input type="text" class="search-field" placeholder="Keresés..." v-model="store.search">

      <!-- Ország -->
      <div class="filter-select">
        <select v-model="store.country">
          <option value="" selected>Ország</option>
          <option value="HU">HU</option>
          <option value="AT">AT</option>
          <option value="SK">SK</option>
          <option value="SI">SI</option>
          <option value="CZ">CZ</option>
        </select>
      </div>

      <!-- Rendezés Ár szerint -->
      <div class="filter-select">
        <select v-model="store.sortOrder">
          <option value="" selected>Rendezés</option>
          <option value="asc">Ár növekvő</option>
          <option value="desc">Ár csökkenő</option>
        </select>
      </div>
    </div>


<div class="filter-bar2">

  <!-- Jármű szűrő -->
  <div class="vehicle-filter">
    <div class="filter-title">Jármű</div>
    <div class="filter-options">
      <label><input type="radio" name="vehicle" :checked="vehicleClass === ''" @change="vehicleFilter('')">Összes</label>
      <label><input type="radio" name="vehicle" :checked="vehicleClass === 'car'" @change="vehicleFilter('car')">Car</label>
      <label><input type="radio" name="vehicle" :checked="vehicleClass === 'motorcycle'" @change="vehicleFilter('motorcycle')">Motorcycle</label>
    </div>
  </div>

  <!-- Matrica  -->
  <div class="duration-filter">
    <div class="filter-title">Időtartam</div>
    <div class="filter-options">
      <button type="button" :class="{ active: store.duration === 'D1' }" @click="durationFilter('D1', $event)">D1</button>
      <button type="button" :class="{ active: store.duration === 'D10' }" @click="durationFilter('D10', $event)">D10</button>
      <button type="button" :class="{ active: store.duration === 'M1' }" @click="durationFilter('M1', $event)">M1</button>
      <button type="button" :class="{ active: store.duration === 'M2' }" @click="durationFilter('M2', $event)">M2</button>
      <button type="button" :class="{ active: store.duration === 'Y1' }" @click="durationFilter('Y1', $event)">Y1</button>
    </div>
  </div>

</div>




    <!-- Skeleton loader, ha töltés alatt van -->
    <div v-if="store.loading" class="skeleton-list">
      <div v-for="n in store.limit" :key="n" class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>

    <ul v-else>
      <li class="card" v-for="product in products" :key="product.id">
        <div class="title">{{ product.name }}</div>
        <div class="info">
          <span class="location"><img src="/location.svg" alt="Location">{{ product.country }}</span>
          <span class="duration"><img src="/ticket2.svg" alt="Vignette">{{ product.duration }}</span>
        </div>
        <div class="price-cta">
          <span class="price">€{{ product.price }}</span>
          <NuxtLink :to="`/products/${product.id}`">Részletek →</NuxtLink>
        </div>

      </li>
    </ul>

    <div class="pagination">
      <button :disabled="page <= 1" @click="page--"><img src="/chevron.svg" style="transform:rotate(180deg);" alt="pagination"></button>
      <button :disabled="page >= maxProducts / limit" @click="page++"><img src="/chevron.svg" alt="pagination"></button>
    </div>


  </section>
</template>
