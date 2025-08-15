import { onBeforeUnmount } from 'vue'
import { useProductsStore } from '../stores/filters'



export const swipe = () =>{
        let startX = 0
        const store = useProductsStore()

        const onTouchStart = (e) => {
            startX = e.touches[0].clientX
        }

        const onTouchEnd = (e) => {
            const endX = e.changedTouches[0].clientX
            const diff = endX - startX

            if (Math.abs(diff) > 50) { // küszöb: 50px
                if (diff < 0 && store.page <= store.maxProducts / store.limit) {
                    // Balra húzás → következő oldal
                    store.page++
                    store.fetchProducts()
                } else {
                    // Jobbra húzás → előző oldal
                    if (diff > 0 && store.page > 1) {
                        store.page--
                        store.fetchProducts()
                    }
                }
            }
        }

        window.addEventListener('touchstart', onTouchStart)
        window.addEventListener('touchend', onTouchEnd)

        onBeforeUnmount(() => {
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchend', onTouchEnd)
        })
}