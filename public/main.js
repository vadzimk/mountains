/**
 * Copyright (c) 2022, Vadzim Krechyk, All rights reserved.
 * **/

/* Tabs */
const SM_BREAKPOINT = 640


function openTab(self, tabId) {
  const theTab = document.getElementById(tabId)
  // console.log("window.innerWidth", window.innerWidth)
  // console.log("self.classList.contains('tab-active')", self.classList.contains('tab-active'))
  if (window.innerWidth < SM_BREAKPOINT && self.classList.contains('tab-active')) {
    // console.log("inner task")
    self.classList.remove('tab-active')
    theTab.style.display = 'none'
    return  // collapse active tab when clicked 2nd time
  }
  const tabContents = document.getElementsByClassName('tab-contents')
  const tabs = document.getElementsByClassName('tab')
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('tab-active')
  }
  self.classList.add('tab-active')
  for (let item of tabContents) {
    item.style.display = "none"
  }
  theTab.style.display = 'block'

}

const getActiveDesktopButtonNumber = () => {
  const desktopButtons = document.getElementById('desktop-buttons').children
  for (let i = 0; i < desktopButtons.length; i++) {
    if (desktopButtons[i].classList.contains('tab-active')) {
      return i
    }
  }
  return undefined
}
const getActiveTabContentsNumber = () => {
  const tabs = document.getElementsByClassName('tab-contents')
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].style.display !== 'none') {
      return i
    }
  }
  return undefined
}
const setActiveDesktopButtonNumber = (num) => {
  const desktopButtons = document.getElementById('desktop-buttons').children
  desktopButtons[num].classList.add('tab-active')
  console.log('set active tab', num)
}

// Reset first tab visibility on breakpoint sm
window.addEventListener("resize", () => {
  if (window.innerWidth > SM_BREAKPOINT) {
    const activeTabContentsNumber = getActiveTabContentsNumber()
    const activeDesktopButtonNumber = getActiveDesktopButtonNumber()
    if (activeTabContentsNumber !== undefined && activeDesktopButtonNumber !== undefined
      && activeDesktopButtonNumber !== activeTabContentsNumber) {
      // console.log('case1')
      setActiveDesktopButtonNumber(activeTabContentsNumber)
    } else if (activeTabContentsNumber !== undefined && activeDesktopButtonNumber !== undefined
      && activeDesktopButtonNumber === activeTabContentsNumber)
    {
      // console.log('case2')
    } else if (activeTabContentsNumber === undefined && activeDesktopButtonNumber !== undefined) {
      // console.log('case3')
      setActiveDesktopButtonNumber(activeTabContentsNumber)
    } else if (activeTabContentsNumber !== undefined && activeDesktopButtonNumber === undefined) {
      // console.log('case4')
      setActiveDesktopButtonNumber(activeTabContentsNumber)
    } else {
      // console.log('case5')
      // console.log("activeTabContentsNumber", activeTabContentsNumber)
      // console.log("activeDesktopButtonNumber", activeDesktopButtonNumber)
      const tabsContents = document.getElementsByClassName('tab-contents')
      // console.log(tabsContents)
      setActiveDesktopButtonNumber(0)
      tabsContents[0].style.display = 'block'
    }
  }
})
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
window.addEventListener("load", (event) => {

  /* Header */
  const setupHeader = () => {
    if (!"IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
      return // no observer in browser
    }
    const headerBar = document.querySelector("header");
    const headerLogoType = document.querySelector("#logotype");
    const targetSection = document.querySelector("#home");

    const handleIntersect = (entries) => {
      // console.log(entries)
      // console.log(entries[0].boundingClientRect.y)
      const breakpointOne = entries[0].boundingClientRect.height * 0.3
      const breakpointTwo = entries[0].boundingClientRect.height * 0.78
      if (entries[0].boundingClientRect.y >= -breakpointOne) {
        headerBar.classList.add("text-white")
        headerBar.classList.remove("bg-white/50")
        headerLogoType.classList.add("hidden")
      } else if (entries[0].boundingClientRect.y < -breakpointOne
        && entries[0].boundingClientRect.y > -breakpointTwo) {
        headerBar.classList.remove("text-white")
        headerBar.classList.remove("bg-white/100")
        headerBar.classList.add("bg-white/50")
        headerLogoType.classList.remove("hidden")
        headerLogoType.classList.add("opacity-50")
      } else { // no intersection
        headerBar.classList.remove("bg-white/50")
        headerBar.classList.add("bg-white/100")
        headerLogoType.classList.add("opacity-100")
        headerLogoType.classList.remove("opacity-50")
      }
    }

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: Array(11).fill().map((_, i) => i / 10),
    }
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(targetSection);
  }
  setupHeader()

  /* Slideshow */
  const setupSlideShow = () => {
    const slides = document.getElementsByClassName("thumbnail")

    const GAP_WIDTH = 10
    const MAX_WIDTH = 910
    const thumbnailsContainer = document.getElementById("thumbnails-container")
    // console.log("window.innerWidth", window.innerWidth) // TODO debug
    thumbnailsContainer.style.width = Math.floor(Math.min(window.innerWidth, MAX_WIDTH) / slides[0].clientWidth) * slides[0].clientWidth + "px"
    const thumbnailsContainerWidth = thumbnailsContainer.getBoundingClientRect().width
    // console.log("thumbnailsContainerWidth", thumbnailsContainerWidth) // TODO debug
    const NUM_VISIBLE_SLIDES = Math.floor(thumbnailsContainerWidth / slides[0].clientWidth)
    // console.log("NUM_VISIBLE_SLIDES", NUM_VISIBLE_SLIDES) // TODO debug

    const thumbnails = document.getElementById("thumbnails")
    const gapClassname = `gap-[${GAP_WIDTH}px]`
    thumbnails.classList.add(gapClassname)

    const widthAvailable = slides[0].clientWidth * NUM_VISIBLE_SLIDES + GAP_WIDTH * (NUM_VISIBLE_SLIDES - 1);
    thumbnails.style.width = `${widthAvailable}px`
    let widthTotal = 0
    for (let slide of slides) {
      let width = slide.clientWidth
      // console.log(width)
      widthTotal += width
    }
    widthTotal = widthTotal + (slides.length - 1) * GAP_WIDTH // except the last item
    // console.log(widthTotal, widthAvailable) //TODO debug
    const numberOfWindows = Math.round(widthTotal / widthAvailable)
    const circleNav = document.getElementById("circle-nav")
    // console.log("numberOfWindows", numberOfWindows) //TODO debug
    let currentDistanceFromParent = 0

    const circleCallback = (windowNumber) => {
      // reset circles active to inactive
      const circles = document.getElementsByClassName("circle")
      let previousActive = null
      for (let i = 0; i < circles.length; i++) {
        if (circles[i].classList.contains("active")) {
          previousActive = i
          circles[i].classList.remove("active")
          circles[i].classList.add("inactive")
        }
        if (i === windowNumber) {
          circles[i].classList.remove("inactive")
          circles[i].classList.add("active")
        }
      }
      // console.log("windowNumber", windowNumber)
      const slide = slides[windowNumber * NUM_VISIBLE_SLIDES]
      const parentLeft = thumbnailsContainer.getBoundingClientRect().left
      const childLeft = slide.getBoundingClientRect().left
      const childDistance = childLeft - parentLeft
      // console.log("childDistance+currentDistanceFromParent", currentDistanceFromParent, childDistance)
      const distance = currentDistanceFromParent + childDistance
      // console.log("translateX: distance", distance)
      thumbnails.style.transform = `translateX(${-1 * distance}px)`
      currentDistanceFromParent = distance
    }

    // add event listeners and active/inactive class
    circleNav.innerHTML = '' //clear child
    for (let i = 0; i < numberOfWindows; i++) {
      const circle = document.createElement('div')
      circle.classList.add("circle")
      if (i === 0) {
        circle.classList.add("active")
      } else {
        circle.classList.add(("inactive"))
      }
      circle.addEventListener('click', () => circleCallback(i))
      circleNav.appendChild(circle)
    }
  }
  setupSlideShow()
  window.addEventListener("resize", setupSlideShow)

}, false);
