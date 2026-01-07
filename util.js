export function parseNcpResponseToDto(response) {
    const dto = {
        userId: response?.userId,
        timestamp: response?.timestamp,
        texts: [],
        choices: [],
        imageUrl: null,
        actionUrl: null,
    };

    for (const bubble of response?.bubbles ?? []) {
        /* 1. 일반 TEXT 메시지 */
        if (bubble?.type === "text") {
            const desc = bubble?.data?.description;
            if (desc) dto.texts.push(desc);
            continue;
        }

        /* 2. TEMPLATE (SINGLEFORM) */
        if (bubble?.type === "template") {
            // image일 경우
            if (bubble?.data?.cover?.type === "image") {
                // title을 texts에 추가
                const title = bubble?.data?.cover?.title;
                if (title) dto.texts.push(title);

                // imageUrl 설정
                const imageUrl = bubble?.data?.cover?.data?.imageUrl;
                if (imageUrl) dto.imageUrl = imageUrl;
                continue;
            }

            // text일 경우
            // 2-1. cover 텍스트 - texts에 추가
            const coverText = bubble?.data?.cover?.data?.description;
            if (coverText) dto.texts.push(coverText);

            // 2-2. 버튼들
            const table = bubble?.data?.contentTable;
            if (!Array.isArray(table)) continue;

            for (const row of table) {
                for (const cell of row ?? []) {
                    const btn = cell?.data;
                    if (btn?.type !== "button") continue;

                    const actionData = btn?.data?.action?.data;
                    const actionType = btn?.data?.action?.type;

                    // button의 action type이 link인 경우 url 전달
                    if (actionType === "link") {
                        const actionUrl = actionData?.url;
                        if (actionUrl) dto.actionUrl = actionUrl;
                        continue;
                    }
                    
                    const label =
                        actionData?.displayText || btn?.title || "선택";

                    const payload =
                        actionData?.postbackFull || // SINGLEFORM 최우선
                        actionData?.postback ||
                        label;

                    dto.choices.push({ label, payload });
                }
            }
        }
    }

    return dto;
}
