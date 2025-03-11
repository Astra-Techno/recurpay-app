import Marzipano from 'marzipano'

export class MarzipanoModel {
	tripodImgSource = '/assets/images/tripod-mask.png'

	editingHotspot = null

	onClickNewHotspot = null

	onClickHotspot = null

	constructor(panoContainer) {
		this.viewer = new Marzipano.Viewer(panoContainer, {
			stage: {
				preserveDrawingBuffer: true,
			},
			controls: { mouseViewMode: 'drag' },
		})
		this.scenes = []
		this.currentScene = null
	}

	addHotspot(hotspotData) {
		const hotspotIcon = document.createElement('i')
		hotspotIcon.classList.add(hotspotData.type || 'blank')
		const hotspotLabel = document.createElement('label')
		hotspotLabel.innerHTML = hotspotData.name || 'Blank Hotspot'
		const hotspotContent = document.createElement('div')
		hotspotContent.classList.add('content')
		hotspotContent.appendChild(hotspotIcon)
		hotspotContent.appendChild(hotspotLabel)
		const hotspotElement = document.createElement('div')
		hotspotElement.classList.add('hotspot')
		hotspotElement.appendChild(hotspotContent)
		const hotspot = this.currentScene.scene
			.hotspotContainer()
			.createHotspot(hotspotElement, hotspotData)
		hotspotElement.addEventListener('contextmenu', event => {
			event.preventDefault()
			event.stopPropagation()
			this.editingHotspot = hotspotData
			if (this.onClickHotspot) {
				this.onClickHotspot(event, hotspotData) // Call the parent callback
			}
		})
		hotspotElement.addEventListener('click', event => {
			event.preventDefault()
			event.stopPropagation()
			this.editingHotspot = hotspotData
			if (this.onClickHotspot) {
				this.onClickHotspot(event, hotspotData) // Call the parent callback
			}
		})
		return hotspot
	}

	clearHotspots() {
		const hotspotContainer = this.currentScene.scene.hotspotContainer()
		var listHotspots = hotspotContainer.listHotspots()
		for (var i = 0; i < listHotspots.length; i++) {
			var listHotspot = listHotspots[i]
			if (listHotspot.domElement().classList.contains('tripod-mask'))
				continue
			if (hotspotContainer.hasHotspot(listHotspot)) {
				hotspotContainer.destroyHotspot(listHotspot)
			}
		}
	}

	setHotspots(hotspots) {
		this.clearHotspots()
		hotspots.forEach(hotspot => {
			this.addHotspot(hotspot)
		})
	}

	setHotspot(coordinates, event) {
		this.editingHotspot = this.addHotspot(coordinates)
		if (this.editingHotspot) {
			if (this.onClickNewHotspot) {
				this.onClickNewHotspot(event, this.editingHotspot)
			}
		}
	}

	cancelHotspot() {
		if (this.editingHotspot) {
			const hotspotContainer = this.currentScene.scene.hotspotContainer()
			if (hotspotContainer.hasHotspot(this.editingHotspot)) {
				hotspotContainer.destroyHotspot(this.editingHotspot)
				this.editingHotspot = null
			}
		}
	}

	addScene(sceneData) {
		const geometry = new Marzipano.EquirectGeometry([{ width: 8000 }])
		const limiter = Marzipano.util.compose(
			Marzipano.RectilinearView.limit.hfov(
				(30 * Math.PI) / 180,
				(160 * Math.PI) / 180,
			),
			Marzipano.RectilinearView.limit.vfov(
				(30 * Math.PI) / 180,
				(160 * Math.PI) / 180,
			),
			Marzipano.RectilinearView.limit.traditional(
				4096,
				(160 * Math.PI) / 180,
			),
		)

		const params = { fov: (100 * Math.PI) / 180 }
		const view = new Marzipano.RectilinearView(params, limiter)
		const source = Marzipano.ImageUrlSource.fromString(sceneData.imageUrl)
		const scene = this.viewer.createScene({
			source,
			geometry,
			view,
			pinFirstLevel: true,
		})
		const tripodMask = document.createElement('div')
		tripodMask.className = 'tripod-mask'
		const tripodImg = document.createElement('img')
		tripodImg.src = this.tripodImgSource
		tripodImg.alt = 'Tripod Mask'
		tripodMask.appendChild(tripodImg)
		scene.hotspotContainer().createHotspot(
			tripodMask,
			{ yaw: 0, pitch: Math.PI / 2 },
			{
				perspective: {
					extraRotations: 'rotateZ(0deg) rotateY(0deg)',
					radius: 1000,
				},
			},
		)

		if (sceneData.hotspots) {
			// sceneData.hotspots.forEach(hotspot => {
			// 	const hotspotElement = document.createElement('div');
			// 	hotspotElement.className = 'hotspot';
			// 	const imgElement = document.createElement('img');
			// 	imgElement.src = hotspot.imgUrl;
			// 	imgElement.alt = hotspot.imgAlt || 'Hotspot image';
			// 	hotspotElement.appendChild(imgElement);
			// 	scene.hotspotContainer().createHotspot(
			// 		hotspotElement,
			// 		{ yaw: hotspot.yaw, pitch: hotspot.pitch },
			// 		{
			// 			perspective: {
			// 				extraRotations: hotspot.extraRotations,
			// 				radius: hotspot.radius
			// 			}
			// 		}
			// 	);
			// });
		}

		const sceneObj = {
			id: sceneData.uid,
			name: sceneData.name,
			scene,
			view,
		}
		this.scenes.push(sceneObj)

		return sceneObj
	}

	async switchToScene(sceneData) {
		let sceneObject = this.scenes.find(scene => scene.uid === sceneData.uid)

		if (!sceneObject) {
			sceneObject = this.addScene(sceneData)
		}

		if (this.currentScene) {
			//await this.currentScene.scene.destroy();
		}
		this.currentScene = sceneObject
		await this.currentScene.scene.switchTo()
		if (sceneData.angle && Object.keys(sceneData.angle).length > 0) {
			const options = {
				transitionDuration: 1000,
			}
			this.currentScene.scene.lookTo(sceneData.angle, options)
		}
		if (sceneData.hotspots) {
			await this.setHotspots(sceneData.hotspots)
		}

		return this.currentScene.view
	}

	getCurrentView() {
		return this.currentScene ? this.currentScene.view : null
	}
}
