async function handleContainerListItemClick(event) {
  event.preventDefault()

  const target = event.currentTarget
  if (!target.payload) return

  const { containerId, containerName, containerIcon } = target.payload
  try {
    await browser.storage.local.set({
      containerId: containerId,
      containerName: containerName,
      containerIcon: containerIcon
    })
    await browser.runtime.sendMessage({
      type: 'UPDATE_ICON'
    });

    document.querySelectorAll('.container-list-item')
      .forEach(btn => btn.classList.remove('selected'))
    target.classList.add('selected')

  } catch (error) {
    console.error('Failed select container: ', error)
  }
}

function createContainerListItem(name, cookieStoreId, iconUrl, color, colorCode, isSelected) {
  const effectiveColor = colorCode || color

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'container-list-item'

  if (isSelected) button.classList.add('selected')
  button.payload = {
    containerId: cookieStoreId,
    containerIcon: iconUrl,
    containerName: name,
  }

  const icon = document.createElement('span')
  icon.className = 'icon'

  if (iconUrl) {
    icon.style.mask = `url(${iconUrl}) center / contain no-repeat`
    icon.style.background = effectiveColor
  } else {
    const fallbackIcon = browser.runtime.getURL('icons/circle-slash-2.svg');
    icon.style.mask = `url(${fallbackIcon}) center / contain no-repeat`;
    icon.style.background = '#4f46e5';
  }

  const label = document.createElement('span')
  label.textContent = name ?? 'Unknown'

  button.append(icon, label)
  button.addEventListener('click', handleContainerListItemClick)

  return button
}

async function initializeUI() {
  const containerList = document.getElementById('container-list')
  if (!browser.contextualIdentities) {
    containerList.textContent = 'Container is disabled'
    return
  }

  try {
    const storageData = await browser.storage.local.get('containerId');
    const containerId = storageData.containerId ?? null;

    const containerInfos = await browser.contextualIdentities.query({})
    if (containerInfos.length <= 0) {
      containerList.textContent = 'Not have containers'
      return
    }
    for (const containerInfo of containerInfos) {
      const item = createContainerListItem(
        containerInfo.name,
        containerInfo.cookieStoreId,
        containerInfo.iconUrl,
        containerInfo.color,
        containerInfo.colorCode,
        containerInfo.cookieStoreId === containerId
      )
      containerList.appendChild(item)
    }

    const notSelectButton = createContainerListItem(
      'Not Select',
      null,
      null,
      null,
      null,
      containerId === null
    )
    containerList.appendChild(notSelectButton)
  } catch (error) {
    containerList.textContent = 'Failed initializeUI'
    console.error('Failed initializeUI: ', error)
  }
}

void initializeUI()