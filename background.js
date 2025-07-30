const iconMap = {
  fingerprint: 'icons/fingerprint.svg',
  briefcase: 'icons/briefcase.svg',
  dollar: 'icons/circle-dollar-sign.svg',
  cart: 'icons/shopping-cart.svg',
  plane: 'icons/plane.svg',
  gift: 'icons/gift.svg',
  food: 'icons/utensils.svg',
  fruit: 'icons/apple.svg',
  pet: 'icons/dog.svg',
  tree: 'icons/trees.svg',
  chill: 'icons/glasses.svg',
  circle: 'icons/circle.svg',
  fence: 'icons/fence.svg',
  'fallback': 'icons/circle-slash-2.svg'
}

async function getSelectedContainerInfo() {
  const { containerId } = await browser.storage.local.get('containerId')
  const { containerIcon } = await browser.storage.local.get('containerIcon')
  const { containerName } = await browser.storage.local.get('containerName')
  return {
    containerId,
    containerIcon,
    containerName
  }
}

async function updateExtensionIcon() {
  const { containerIcon, containerName } = await getSelectedContainerInfo()

  let iconName = 'fallback'
  try {
    if (!!containerIcon) {
      iconName = Object.keys(iconMap).find(key =>
        containerIcon.includes(key)
      )
    }
    const iconPath = iconMap[iconName] || fallbackIcon
    await browser.browserAction.setIcon({ path: iconPath })
    await browser.browserAction.setTitle({ title: containerName })
  } catch (error) {
    console.error('Failed update extension icon:', error)
    await browser.action.setIcon({ path: fallbackIcon })
  }
}

async function replaceTab(tabId, url, containerId) {
  await browser.tabs.create({
    url: url,
    cookieStoreId: containerId
  })
  await browser.tabs.remove(tabId)
}

browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'UPDATE_ICON') {
    await updateExtensionIcon()
  }
})

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url || !changeInfo.url.startsWith('http')) return
  if (tab.cookieStoreId !== 'firefox-default') return

  const { containerId } = await getSelectedContainerInfo()
  if (!containerId) return

  try {
    await replaceTab(tabId, changeInfo.url, containerId)
  } catch (e) {
    console.error('Failed to create tab:', e)
  }
})

browser.tabs.onCreated.addListener(async (tab) => {
  const { containerId } = await getSelectedContainerInfo()
  if (!containerId) return
  if (tab.cookieStoreId !== 'firefox-default') return

  setTimeout(async () => {
    try {
      const updatedTab = await browser.tabs.get(tab.id)
      if (!updatedTab) return

      await replaceTab(updatedTab.id, updatedTab.url, containerId)
    } catch (error) {
    }
  }, 100)
})

void updateExtensionIcon()