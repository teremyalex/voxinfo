<script setup>
import { useRoute, useHead } from '#imports'
import { ref, onMounted } from 'vue'
import '../stores/style.css'

const route = useRoute()
const id = Number(route.params.id)

const { data, pending } = await useFetch(`http://localhost:4000/products/${id}`)
const product = data.value

const isFavorite = ref(false)

useHead({
  title: product ? `${product.name} - Európai matrica` : 'Termék részletek',
  meta: [
    {
      name: 'description',
      content: product ? `Részletes információ a ${product.name} matricáról` : 'Termék részletek oldal'
    }
  ]
})

function toggleFavorite() {
  if (localStorage.getItem('favorites') === null) {
    localStorage.setItem('favorites', JSON.stringify([]))
  }
  const favorites = JSON.parse(localStorage.getItem('favorites'))
  if (favorites.includes(id)) {
    favorites.splice(favorites.indexOf(id), 1)
    isFavorite.value = false
  } else {
    favorites.push(id)
    isFavorite.value = true
  }
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

onMounted(() => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  isFavorite.value = favorites.includes(id)
})


</script>

<template>
  <section class="product">
    <div class="product-btn">
      <NuxtLink @click="$router.back()">← Vissza</NuxtLink>

      <button type="button" :class="{ active: isFavorite }" @click="toggleFavorite" class="favorite">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-25 -25 562 562" style="overflow: visible">
          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
              fill="none" stroke="#222" stroke-width="60"/>
        </svg>
      </button>
    </div>

    <div v-if="pending">
      Betöltés...
    </div>

    <div v-else-if="product">

      <div class="upper-details">
        <div>
          <div class="details-title">Ország</div>
          <div class="details-data">{{ product.country }}</div>
        </div>

        <div>
          <div class="details-title">Jármű</div>
          <div class="details-data">{{ product.vehicle }}</div>
        </div>

        <div>
          <div class="details-title">Időtartam</div>
          <div class="details-data">{{ product.duration }}</div>
        </div>
      </div>




      <div class="main-details">
        <img :src="product.image" :alt="product.name" loading="lazy" />
        <div class="main-data">
          <h3>{{ product.name }}</h3>
          <div class="details-price">€{{ product.price }}</div>
          <div class="details-valid">
            <div class="details-title">Érvényesség</div>
            <div><span class="valid-date">{{ product.valid_from }}</span> → <span class="valid-date">{{ product.valid_to }}</span></div>
          </div>
          <div class="details-tags">
            <div class="details-title">Címkék</div>
            <div class="details-tag"><span v-for="(tag, index) in product.tags" :key="index">{{ tag }}</span></div>
          </div>
        </div>

      </div>

    </div>

    <div v-else>
      <p>Nem található a termék.</p>
    </div>



  </section>
</template>
