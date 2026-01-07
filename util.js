export function parseNcpResponseToDto(response) {
    const dto = {
        userId: response?.userId,
        timestamp: response?.timestamp,
        texts: [],
        coverText: undefined,
        choices: [],
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
            // 2-1. cover 텍스트 (질문)
            const cover = bubble?.data?.cover?.data?.description;
            if (cover) dto.coverText = cover;

            // 2-2. 버튼들
            const table = bubble?.data?.contentTable;
            if (!Array.isArray(table)) continue;

            for (const row of table) {
                for (const cell of row ?? []) {
                    const btn = cell?.data;
                    if (btn?.type !== "button") continue;

                    const actionData = btn?.data?.action?.data;

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
