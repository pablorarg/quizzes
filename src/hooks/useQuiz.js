import { useEffect, useState } from 'react'
import getQuiz from 'services/getQuiz'

const INIT_FEEDBACK = {
    quiz: [],
    loading: true,
    hasError: false,
    message: null
}

export default function useQuiz({ category = null, difficult = null }) {

    const [feedback, setFeedback] = useState(INIT_FEEDBACK)

    useEffect(() => {

        if (!category && !difficult) return

        const newFeedback = {
            ...feedback,
            loading: true
        }

        setFeedback(newFeedback)

        getQuiz({ category: category, difficult: difficult })
            .then(response => {

                const textWithQuotReplaced = JSON.stringify(response).replace(/&quot;/g, '\'')
                const textParsedToJson = JSON.parse(textWithQuotReplaced)

                const newFeedback = {
                    ...feedback,
                    loading: false,
                    quiz: textParsedToJson
                }
                setFeedback(newFeedback)
            })
            .catch(error => {
                const newFeedback = {
                    ...feedback,
                    loading: false,
                    hasError: true,
                    message: error.message
                }
                setFeedback(newFeedback)
            });

    }, [category, difficult])

    return { feedback }

}