<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Role;
use App\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SqliController extends Controller
{
    public function index()
    {

        $client = new Client(['base_uri' => 'http://localhost:3000/']);
        $response = $client->request('GET', 'comentarios');
        $body = $response->getBody();
        $content = $body->getContents();
        $comments = json_decode($content);

        //Log::info($comments);

        $users = User::all();

        return view('admin.sqli.index', compact('comments'));
    }

    public function create()
    {
        abort_unless(\Gate::allows('user_create'), 403);

        $roles = Role::all()->pluck('title', 'id');

        return view('admin.users.create', compact('roles'));
    }

    public function store(StoreUserRequest $request)
    {
        abort_unless(\Gate::allows('user_create'), 403);

        $user = User::create($request->all());
        $user->roles()->sync($request->input('roles', []));

        return redirect()->route('admin.users.index');
    }

    public function edit(User $user)
    {
        abort_unless(\Gate::allows('user_edit'), 403);

        $roles = Role::all()->pluck('title', 'id');

        $user->load('roles');

        return view('admin.users.edit', compact('roles', 'user'));
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        abort_unless(\Gate::allows('user_edit'), 403);

        $user->update($request->all());
        $user->roles()->sync($request->input('roles', []));

        return redirect()->route('admin.users.index');
    }

    public function show(User $user)
    {
        abort_unless(\Gate::allows('user_show'), 403);

        $user->load('roles');

        return view('admin.users.show', compact('user'));
    }

    public function destroy(User $user)
    {
        abort_unless(\Gate::allows('user_delete'), 403);

        $user->delete();

        return back();
    }

    public function massDestroy(MassDestroyUserRequest $request)
    {
        User::whereIn('id', request('ids'))->delete();

        return response(null, 204);
    }

    public function searchUserById(Request $request)
    {
        $input = $request->all();
        Log::info($input['id']);

        $client = new Client(['base_uri' => 'http://localhost:3000/']);
        $response = $client->request('GET', 'users/' . $input['id']);
        $body = $response->getBody();
        $content = $body->getContents();
        $users = json_decode($content);
        Log::info($users);

        return response()->json(['success' => $users]);
    }

    public function searchUserByName(Request $request)
    {
        $input = $request->all();
        Log::info($input['name']);

        $client = new Client(['base_uri' => 'http://localhost:3000/']);
        $response = $client->request('POST', 'userByName', [
            'json' => [
                'name' => $input['name'],
            ]]);
        $body = $response->getBody();
        $content = $body->getContents();
        $users = json_decode($content);
        Log::info($users);

        return response()->json(['success' => $users]);
    }

}
