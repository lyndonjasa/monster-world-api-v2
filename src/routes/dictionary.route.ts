import express from 'express'
import { UploadDictionaryRequest } from '../models/requests/upload-dictionary.request';
import { getDictionaries, uploadDictionaries } from '../services/dictionary.service';

const DictionaryRouter = express.Router();

/**
 * Get Dictionary values
 */
DictionaryRouter.get('/dictionary', async (_, res) => {
  try {
    const values = await getDictionaries();

    res.send(values);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Upload Dictionary values
 */
DictionaryRouter.post('/dictionary/upload', async (req, res) => {
  try {
    const request = req.body as UploadDictionaryRequest[];

    const values = await uploadDictionaries(request);

    res.send(values);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default DictionaryRouter;