const button = document.getElementById('advice-button') as HTMLButtonElement
const adviceText = document.getElementById('advice-text') as HTMLParagraphElement
const adviceId = document.getElementById('advice-id') as HTMLSpanElement

type SlipProps = {
    slip: {
        id: string,
        advice: string
    }
}

async function generateAdvice() {
    try {
        const response = await fetch(`https://api.adviceslip.com/advice`)

        if(!response.ok) throw new Error('Error fetching advice')

        const { slip }: SlipProps = await response.json()

        adviceId.textContent = slip.id
        adviceText.textContent = `"${slip.advice}"`

    } catch (error) {
        console.log(error);
        adviceId.textContent = 'Id not found'
        adviceText.textContent = 'Advice not found'
    }
}

button.addEventListener('click', generateAdvice)

generateAdvice()