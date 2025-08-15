export const animations = () => {
    const cards = document.querySelectorAll('.card')
    cards.forEach(item=> item.classList.remove("visible"))
    cards.forEach(item=>{
        const index = Array.from(cards).indexOf(item)
        setTimeout(()=>item.classList.add("visible"), 50*(index+2))
    })
}