import {
    archi,
    jai,
    out,
    cbot,
} from "../utils";

export const navLists = ['Home', 'Try our bot!', 'About Us', 'Tech Stacks', 'Our Team', 'Contact us'];

export const hightlightsSlides = [
    {
        id: 1,
        textLists: [
            "Get instant information about the Department of Justice.",
            "Your comprehensive guide to legal services.",
        ],
        video: jai,
        videoDuration: 8,
    },
    {
        id: 2,
        textLists: [
            "Discover the architecture behind our chatbot.",
            "Learn about the LLM technology powering it.",
            "Efficiently handles large data sets.",
        ],
        video: archi,
        videoDuration: 4,
    },
    {
        id: 3,
        textLists: [
            "See the user interface of our chatbot.",
            "Designed for a seamless user experience.",
            "Easy access to all DoJ-related information.",
        ],
        video: cbot,
        videoDuration: 6,
    },
    {
        id: 4,
        textLists: [
            "Representing our commitment to justice.",
            "Innovative solutions for legal assistance.",
        ],
        video: out,
        videoDuration: 5,
    },
];
