import PptxGenJS from "pptxgenjs";

export interface SlideData {
    title: string;
    bullets: string[];
    notes?: string;
}

/**
 * Generate a PowerPoint presentation from structured slide data
 * @param slides - Array of slide data objects
 * @param filename - Name for the output file (without extension)
 */
export const generateResearchPPT = (slides: SlideData[], filename: string) => {
    const pres = new PptxGenJS();

    // Set presentation metadata
    pres.author = "AI Research App";
    pres.company = "Research Platform";
    pres.subject = "AI-Generated Research Presentation";
    pres.title = filename;

    slides.forEach((slideContent, index) => {
        const slide = pres.addSlide();

        // Add slide number footer
        slide.addText(`${index + 1} / ${slides.length}`, {
            x: "90%",
            y: "95%",
            w: "10%",
            fontSize: 10,
            color: "999999",
            align: "right",
        });

        // Add Title
        slide.addText(slideContent.title, {
            x: 0.5,
            y: 0.5,
            w: "90%",
            fontSize: 28,
            bold: true,
            color: "363636",
            fontFace: "Arial",
        });

        // Add Bullets
        slide.addText(
            slideContent.bullets.map((b) => `• ${b}`).join("\n"),
            {
                x: 0.5,
                y: 1.8,
                w: "90%",
                h: "60%",
                fontSize: 18,
                color: "606060",
                fontFace: "Arial",
                valign: "top",
            }
        );

        // Add Speaker Notes
        if (slideContent.notes) {
            slide.addNotes(slideContent.notes);
        }
    });

    // Write file (browser download)
    pres.writeFile({ fileName: `${filename}.pptx` });
};

/**
 * Generate a presentation with a custom theme
 */
export const generateThemedPPT = (
    slides: SlideData[],
    filename: string,
    theme: {
        primaryColor?: string;
        secondaryColor?: string;
        fontFamily?: string;
    } = {}
) => {
    const pres = new PptxGenJS();

    const primaryColor = theme.primaryColor || "1E40AF";
    const secondaryColor = theme.secondaryColor || "3B82F6";
    const fontFamily = theme.fontFamily || "Arial";

    pres.author = "AI Research App";
    pres.subject = "AI-Generated Research Presentation";
    pres.title = filename;

    slides.forEach((slideContent, index) => {
        const slide = pres.addSlide();

        // Add themed background shape
        slide.addShape(pres.ShapeType.rect, {
            x: 0,
            y: 0,
            w: "100%",
            h: 0.8,
            fill: { color: primaryColor },
        });

        // Add title with white text on colored background
        slide.addText(slideContent.title, {
            x: 0.5,
            y: 0.2,
            w: "90%",
            fontSize: 28,
            bold: true,
            color: "FFFFFF",
            fontFace: fontFamily,
        });

        // Add slide number
        slide.addText(`${index + 1} / ${slides.length}`, {
            x: "90%",
            y: "95%",
            w: "10%",
            fontSize: 10,
            color: "999999",
            align: "right",
        });

        // Add content bullets
        slide.addText(
            slideContent.bullets.map((b) => `• ${b}`).join("\n"),
            {
                x: 0.5,
                y: 1.5,
                w: "90%",
                h: "70%",
                fontSize: 18,
                color: "363636",
                fontFace: fontFamily,
                valign: "top",
            }
        );

        // Add speaker notes
        if (slideContent.notes) {
            slide.addNotes(slideContent.notes);
        }
    });

    pres.writeFile({ fileName: `${filename}.pptx` });
};
