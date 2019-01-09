class FloraStatus {

    update (svg, deviceDisplay) {

        let topOffset = 0
        let leftOffset = 40

        const width = 400
        const svgWidth = 455

        const height = 300
        const svgHeight = 300

        const lineHeight = 30
        const graphOffset = 60
        const textOffset = 8
        const thresholdOffset = 20

        const colorGrey = 'rgb(0,0,0,0.6)'
        const colorGreyLight = 'rgb(0,0,0,0.4)'
        const colorGreySuperLight = 'rgb(0,0,0,0.07)'
        const background = 'rgb(247,245,245)'
        const backgroundRed = 'rgb(255,211,203,0.95)'
        const backgroundGreen = 'rgb(211,254,196,0.95)'

        const backgroundLineRed = 'rgb(231,177,173)'
        const backgroundLineGreen = 'rgb(179,224,162)'

        for (const capabilityName in deviceDisplay.capabilities) {
            const capability = deviceDisplay.capabilities[capabilityName]

            topOffset += graphOffset
            const minValue = capability.min
            const maxValue = capability.max
            let value = capability.value

            const startValue = minValue - (maxValue - minValue)
            const endValue = maxValue + (maxValue - minValue)

            // randomize
            // value = Math.floor(Math.random() * (endValue - startValue) ) + startValue;

            const range = (endValue - startValue)

            let title = svg.getElementById(svg.id + '-title');
            title.textContent = deviceDisplay.name + ' (' + deviceDisplay.lastUpdated + ')';

            let min = svg.getElementById(svg.id + '-' + capabilityName + '-min');
            min.textContent = maxValue + capability.suffix;

            let max = svg.getElementById(svg.id + '-' + capabilityName + '-max');
            min.textContent = minValue + capability.suffix;

            let graph = svg.getElementById(svg.id + '-' + capabilityName + '-graph');
            graph.setAttributeNS(null, 'width', this.percentage(value - startValue, range, width))
            graph.setAttributeNS(null, 'fill', (value <= maxValue && value >= minValue)
              ? backgroundGreen
              : backgroundRed,
            );

            let graphLabel = svg.getElementById(svg.id + '-' + capabilityName + '-title');
            graphLabel.setAttribute('x', leftOffset + this.percentage(value - startValue, range, width) - textOffset)
            graphLabel.textContent = value + capability.suffix;
        }

        return svg
    }

    /**
     * @param deviceDisplay
     * @returns {Element}
     */
    render (deviceDisplay) {

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.id = deviceDisplay.id

        let topOffset = 0
        let leftOffset = 40

        const width = 400
        const svgWidth = 455

        const height = 300
        const svgHeight = 300

        const lineHeight = 30
        const graphOffset = 60
        const textOffset = 8
        const thresholdOffset = 20

        svg.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight + '')

        const colorGrey = 'rgb(0,0,0,0.6)'
        const colorGreyLight = 'rgb(0,0,0,0.4)'
        const colorGreySuperLight = 'rgb(0,0,0,0.07)'
        const background = 'rgb(247,245,245)'
        const backgroundRed = 'rgb(255,211,203,0.95)'
        const backgroundGreen = 'rgb(211,254,196,0.95)'

        const backgroundLineRed = 'rgb(231,177,173)'
        const backgroundLineGreen = 'rgb(179,224,162)'

        svg.appendChild(this.title(
          svg.id + '-title',
          leftOffset - textOffset,
          topOffset + (lineHeight / 2),
          colorGrey,
          deviceDisplay.name + ' (' + deviceDisplay.lastUpdated + ')',
        ))

        for (const capabilityName in deviceDisplay.capabilities) {
            const capability = deviceDisplay.capabilities[capabilityName]

            topOffset += graphOffset
            const minValue = capability.min
            const maxValue = capability.max
            const value = capability.value

            const startValue = minValue - (maxValue - minValue)
            const endValue = maxValue + (maxValue - minValue)

            const range = (endValue - startValue)

            svg.appendChild(this.rect(
              svg.id + '-' + capabilityName + '-background',
              leftOffset,
              topOffset,
              width,
              lineHeight,
              background,
            ))

            svg.appendChild(this.rect(
              svg.id + '-' + capabilityName + '-min-line',
              leftOffset + this.percentage(minValue - startValue, range, width),
              topOffset - thresholdOffset,
              1,
              lineHeight + thresholdOffset,
              colorGreySuperLight,
            ))

            svg.appendChild(this.capabilityThresholdTitle(
              svg.id + '-' + capabilityName + '-min',
              leftOffset +
              this.percentage(minValue - startValue, range, width) - textOffset,
              topOffset - (thresholdOffset / 2),
              colorGreyLight,
              minValue + capability.suffix,
              'end',
            ))

            svg.appendChild(this.rect(
              svg.id + '-' + capabilityName + '-max-line',
              leftOffset + this.percentage(maxValue - startValue, range, width),
              topOffset - thresholdOffset,
              1,
              lineHeight + thresholdOffset,
              colorGreySuperLight,
            ))

            svg.appendChild(this.capabilityThresholdTitle(
              svg.id + '-' + capabilityName + 'max',
              leftOffset +
              this.percentage(maxValue - startValue, range, width) + textOffset,
              topOffset - (thresholdOffset / 2),
              colorGreyLight,
              maxValue + capability.suffix,
              'start',
            ))

            svg.appendChild(this.rect(
              svg.id + '-' + capabilityName + '-graph',
              leftOffset,
              topOffset,
              this.percentage(value - startValue, range, width),
              lineHeight,
              (value <= maxValue && value >= minValue)
                ? backgroundGreen
                : backgroundRed,
            ))

            svg.appendChild(this.capabilityValueTitle(
              svg.id + '-' + capabilityName + '-title',
              leftOffset + this.percentage(value - startValue, range, width) -
              textOffset,
              topOffset + (lineHeight / 2),
              colorGrey,
              value + capability.suffix,
              'end',
            ))

            svg.appendChild(this.icon(
              svg.id + '-' + capabilityName + '-icon',
              5,
              topOffset,
              capability.sensor.toLowerCase(),
            ))
        }

        return svg
    }

    icon (id, x, y, name) {
        const icon = document.createElementNS('http://www.w3.org/2000/svg',
          'image')
        icon.id = id
        icon.setAttributeNS(null, 'x', x)
        icon.setAttributeNS(null, 'y', y)
        icon.setAttributeNS(null, 'height', 28)
        icon.setAttributeNS(null, 'width', 28)
        icon.setAttributeNS(null, 'href', 'assets/icons/' + name + '.svg')
        icon.setAttributeNS(null, 'class', 'capability-icon')

        return icon
    }

    percentage (start, range, width) {
        const value = (width / (range / start))
        if (value > width) {
            return width
        }
        if (value < 0) {
            return 50
        }
        return value
    }

    rect (id, x, y, width, height, color) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg',
          'rect')
        rect.id = id
        rect.setAttributeNS(null, 'x', x)
        rect.setAttributeNS(null, 'y', y)
        rect.setAttributeNS(null, 'rx', 8)
        rect.setAttributeNS(null, 'width', width)
        rect.setAttributeNS(null, 'height', height)
        rect.setAttributeNS(null, 'fill', color)

        return rect
    }

    title (id, x, y, color, content) {
        const text = document.createElementNS('http://www.w3.org/2000/svg',
          'text')
        text.id = id
        text.setAttribute('x', x)
        text.setAttribute('y', y)
        text.setAttribute('fill', color)
        text.setAttribute('text-anchor', 'start')
        text.setAttribute('alignment-baseline', 'middle')
        text.setAttribute('font-family', 'sans-serif')
        text.setAttribute('font-size', '1.1em')
        text.textContent = content

        return text
    }

    capabilityValueTitle (id, x, y, color, content, position) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')

        text.id = id
        text.setAttribute('x', x)
        text.setAttribute('y', y)
        text.setAttribute('fill', color)
        text.setAttribute('text-anchor', position)
        text.setAttribute('font-family', 'sans-serif')
        text.setAttribute('alignment-baseline', 'middle')
        text.setAttribute('font-size', '0.7em')
        text.textContent = content

        return text
    }

    capabilityThresholdTitle (id, x, y, color, content, position) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.id = id
        text.setAttribute('x', x)
        text.setAttribute('y', y)
        text.setAttribute('fill', color)
        text.setAttribute('text-anchor', position)
        text.setAttribute('alignment-baseline', 'middle')
        text.setAttribute('font-family', 'sans-serif')
        text.setAttribute('font-size', '0.5em')
        text.textContent = content

        return text
    }
}