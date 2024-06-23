import { fetchCollectionData } from './fetch';
import {
  acceptedResponse,
  invalidUserMessage,
  invalidUsernameResponse,
  successfulResponse,
  successfulXml,
} from './test.xml';

describe('fetch bgg xml data', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  it('calls the bgg api and a status if accepted', async () => {
    mockFetch.mockResolvedValueOnce(acceptedResponse);

    const result = await fetchCollectionData('testBggName');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('testBggName'),
    );
    expect(result).toEqual({
      status: 202,
      message: 'Accepted',
      data: '',
    });
  });

  it('calls the bgg api and returns the xml results as text', async () => {
    mockFetch.mockResolvedValueOnce(successfulResponse);

    const result = await fetchCollectionData('testBggName');

    expect(result).toEqual({
      status: 200,
      message: 'Success',
      data: successfulXml,
    });
  });

  it('returns error results if the request was invalid', async () => {
    mockFetch.mockResolvedValueOnce(invalidUsernameResponse);

    const result = await fetchCollectionData('invalid');

    expect(result).toEqual({
      status: 400,
      message: invalidUserMessage,
      data: '',
    });
  });
});
