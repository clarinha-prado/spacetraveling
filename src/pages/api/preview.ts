import { Document } from '@prismicio/client/types/documents';
import { getPrismicClient } from '../../services/prismic';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { createPreviewResolver } from '@prismicio/client/types/PreviewResolver';

function linkResolver(doc: Document): string {
    return `/post/${doc.uid}`;
}

const apiEndpoint = "https://spacetravelingx.cdn.prismic.io/api/v2";
const accessToken = "";

// Client method to query from the Prismic repo
const Client = (req = null) =>
    Prismic.client(apiEndpoint, createClientOptions(req, accessToken));

const createClientOptions = (req = null, prismicAccessToken = null) => {
    const reqOption = req ? { req } : {};
    const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {};
    return {
        ...reqOption,
        ...accessTokenOption,
    };
};

const Preview = async (req, res) => {
    const { token: ref, documentId } = req.query;
    const redirectUrl = await Client(req)
        .getPreviewResolver(ref, documentId)
        .resolve(linkResolver, "/");

    if (!redirectUrl) {
        return res.status(401).json({ message: "Invalid token" });
    }

    res.setPreviewData({ ref });
    res.writeHead(302, { Location: `${redirectUrl}` })
    res.end();
};

export default Preview;